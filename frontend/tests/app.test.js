// Navbar.js 
// 1. Imports
import {link,uselocation} from 'react-router-dom' ;
import '../Navbar.css' ;

// 2.Component structure
const Navbar = () => {
  const location = uselocation();

  const isActiveRoute = (path) => {
    return location.pathname === path ? "nav-item active" : "nav-item";
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <link to="/" className="navbar-brand">
            Digital Visitor's Book
          </link>
          <div className="nav-links">
            <link
              to="/register"
              className={isActiveRoute('/register')}
            >
              Register Visitor
            </link>
            <link
              to="/visitors"
              className={isActiveRoute('/visitors')}
            >
              Visitors List
            </link>
            <link
              to="/dashboard"
              className={isActiveRoute('/dashboard')}
            >
              Dashboard
            </link>
          </div>
        </div>
      </div>
    </nav>
  );
};