// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/Navbar.css";
// import { useAuth } from "../context/AuthContext";

// const Navbar = () => {
//   // Assuming 'user' is an object that contains 'name' and 'role'
//   // If your 'user' is just a string, you might need to extract the role from elsewhere
//   const { user, logout } = useAuth(); 
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   // Determine the display name and role
//   // This handles both cases: if user is an object {name, role} or just a string
//   const userName = typeof user === 'object' ? user.name : user;
//   const userRole = typeof user === 'object' ? user.role : null;

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Link to="/" className="navbar-logo">
//           <i className="fa-solid fa-building-columns logo-icon"></i>
//           <h2> 🏛️ CitiSolve</h2>
//         </Link>
//       </div>

//       <div className="navbar-right">
//         {user ? (
//           <>
//             <div className="nav-links">
//               {/* ✅ ONLY show these to Citizens */}
//               {userRole === 'Citizen' && (
//                 <>
//                   <Link to='/complaintForm' className="nav-item">
//                     Submit Complaint
//                   </Link>
//                   <Link to='/my-complaints' className="nav-item">
//                     My Complaints
//                   </Link> 
//                 </>
//               )}

//               {/* ✅ OPTIONAL: Show Admin Dashboard link only to Admins */}
//               {userRole === 'Admin' && (
//                 <Link to='/admin-dashboard' className="nav-item">
//                   Admin Dashboard
//                 </Link>
//               )}
//             </div>

//             <span className="welcome-text">
//               Welcome, <strong>{userName}</strong>
//             </span>
//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <div className="auth-buttons">
//             <Link to="/login" className="nav-btn login-btn">Login</Link>
//             <Link to="/register" className="nav-btn register-btn">Register</Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, userRole, logout } = useAuth(); // Pulling userRole here
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <i className="fa-solid fa-building-columns logo-icon"></i>
          <h2> 🏛️ CitiSolve</h2>
        </Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="nav-links">
              {/* ✅ THIS SECTION IS FOR CITIZENS */}
              {userRole === 'Citizen' && (
                <>
                  <Link to='/complaintForm' className="nav-item">
                    Submit Complaint
                  </Link>
                  <Link to='/my-complaints' className="nav-item">
                    My Complaints
                  </Link> 
                </>
              )}

              {/* ✅ THIS SECTION IS FOR ADMINS */}
              {userRole === 'Admin' && (
                <Link to='/admin-dashboard' className="nav-item">
                  Admin Dashboard
                </Link>
              )}
            </div>

            <span className="welcome-text">
              Welcome, <strong>{user}</strong>
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="nav-btn login-btn">Login</Link>
            <Link to="/register" className="nav-btn register-btn">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;