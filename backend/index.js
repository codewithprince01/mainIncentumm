const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const csurf = require("csurf");
require("dotenv").config();
const { connectToDatabase } = require("./src/db/index.js");

// Set fallback environment variables if not provided
process.env.MONGO_URI = process.env.MONGO_URI ;
process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ;
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ;
process.env.ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET ;

// Routers
const userRouter = require("./src/routes/user.router");
const formRouter = require("./src/routes/individualForm.router");
const multiStepFormRouter = require("./src/routes/multiStepForm.router");
const loanApplicationRouter = require("./src/routes/loanApplication.router");
const adminRouter = require("./src/routes/admin.router");
const { verifyAdminJWT } = require("./src/middleware/adminAuth.middleware");

const app = express();
const port = process.env.PORT || 8080;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'", 
          "http://localhost:5174",
          "http://localhost:5173", 
          "http://localhost:3000"
        ],
      },
    },
  })
);
app.use(
  cors({
    origin: [
      process.env.VITE_API_URL || "http://localhost:5173",
      "http://localhost:5174", // Add explicit frontend URL
      "http://localhost:3000"  // Common React default
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    credentials: true, // Required for cookies to be sent
    exposedHeaders: ["Set-Cookie", "X-CSRF-Token"],
  })
);
app.use(limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "default-secret"));
app.use("/uploads", express.static("uploads", {
  setHeaders: (res) => {
    res.set("X-Content-Type-Options", "nosniff");
  },
}));

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(301, `https://${req.header("host")}${req.url}`);
    }
    next();
  });
}

// CSRF Protection (selective application)
const csrfProtection = csurf({
  cookie: {
    key: "_csrf",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  secret: process.env.CSRF_SECRET,
});
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use("/api/users", userRouter); 
app.use("/api/form", formRouter); 
app.use("/api/multi-step-form", multiStepFormRouter); 
app.use("/api/loan-applications", loanApplicationRouter); 
app.use("/api/admin", adminRouter); 

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Error Handling for CSRF
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  // General error handler
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Connect to Database
connectToDatabase();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
