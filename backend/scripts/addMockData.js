const mongoose = require('mongoose');
const { LoanApplication } = require('../src/models/LoanApplication.model');
const { User } = require('../src/models/authentication/User.models');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const addMockData = async () => {
  try {
    // Find the user with email "sample@gmail.com"
    const user = await User.findOne({ email: 'sample@gmail.com' });
    
    if (!user) {
      console.log('User "sample@gmail.com" not found');
      return;
    }

    console.log('Found user:', user.name, user.email);

    // Create mock applications
    const mockApplications = [
      {
        userId: user._id,
        loanType: 'personal',
        loanAmount: 500000,
        tenure: 24,
        purpose: 'Home renovation and furniture purchase',
        status: 'approved',
        personalDetails: {
          fullName: user.name,
          email: user.email,
          mobile: user.phoneNumber
        },
        submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        userId: user._id,
        loanType: 'home',
        loanAmount: 2500000,
        tenure: 60,
        purpose: 'Purchase of residential property in Mumbai',
        status: 'under_review',
        personalDetails: {
          fullName: user.name,
          email: user.email,
          mobile: user.phoneNumber
        },
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        userId: user._id,
        loanType: 'business',
        loanAmount: 1000000,
        tenure: 36,
        purpose: 'Expansion of textile business and equipment purchase',
        status: 'submitted',
        personalDetails: {
          fullName: user.name,
          email: user.email,
          mobile: user.phoneNumber
        },
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        userId: user._id,
        loanType: 'vehicle',
        loanAmount: 800000,
        tenure: 48,
        purpose: 'Purchase of commercial vehicle for transportation business',
        status: 'disbursed',
        personalDetails: {
          fullName: user.name,
          email: user.email,
          mobile: user.phoneNumber
        },
        submittedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      }
    ];

    // Delete existing applications for this user (if any)
    await LoanApplication.deleteMany({ userId: user._id });
    console.log('Deleted existing applications for user');

    // Insert new mock applications one by one to trigger pre-save hooks
    const createdApplications = [];
    for (const appData of mockApplications) {
      const app = new LoanApplication(appData);
      await app.save();
      createdApplications.push(app);
    }
    
    console.log(`Created ${createdApplications.length} mock applications for user ${user.name}`);

    createdApplications.forEach((app, index) => {
      console.log(`${index + 1}. ${app.applicationId} - ${app.loanType} - ₹${app.loanAmount.toLocaleString()} - ${app.status}`);
    });

  } catch (error) {
    console.error('Error adding mock data:', error);
  }
};

const main = async () => {
  await connectDB();
  await addMockData();
  mongoose.connection.close();
  console.log('Mock data added successfully!');
};

main().catch(console.error); 