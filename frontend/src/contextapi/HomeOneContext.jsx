// import axios from "axios";
// import { createContext, useEffect, useState } from "react";

// export const HomeOneContext = createContext({});

// export function HomeOneContextProvider({ children }) {
//   const [user, setUser] = useState(""); // Default to null to signify the user hasn't been fetched yet

//   useEffect(() => {
//     axios
//       .get('http://localhost:8080/api/v1/forms/form-one', {
//         withCredentials: true, // To include cookies if needed
//       })
//       .then((response) => {
//         console.log("Fetched data", response); // Response object contains the data inside `response.data`
//         setUser(response); // Update state with fetched data
//       })
//       .catch((err) => {
//         console.error("Error fetching forms:", err); // Improved error logging
//       });
//   }, []); // Empty dependency array ensures this runs only once when the component mounts

//   return (
//     <HomeOneContext.Provider value={{ user, setUser }}>
//       {children}
//     </HomeOneContext.Provider>
//   );
// }



