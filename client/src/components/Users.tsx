// import { useState, useEffect } from "react";
// import axios from "../api/axios";

// function Users() {
//   const [users, setUsers] = useState<any[]>();

//   useEffect(() => {
//     let isMounted = true;
//     const controller = new AbortController();

//     const getUsers = async () => {
//       try {
//         const response = await axios.get("/users", {
//           signal: controller.signal,
//         });

//         console.log("res from axiso: ", response.data);

//         isMounted && setUsers(response.data);
//       } catch (error: any) {
//         console.log(error.message);
//       }
//     };

//     getUsers();

//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, []);
//   return (
//     <article>
//       <h2>Users Lists</h2>
//       {users?.length ? (
//         <ul>
//           {users.map((user, index) => (
//             <li key={index}>{user?.username}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>No users to display</p>
//       )}
//     </article>
//   );
// }

// export default Users;
