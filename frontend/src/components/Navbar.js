import { Link, useLocation } from 'react-router-dom';
// link - React Router component for navigation without page reload,
//  uselocation - Hook to access the current URL location
import '../Navbar.css'; //CSS file for styling

const Navbar = () => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path ? "nav-item active" : "nav-item";
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            Digital Visitor's Book
          </Link>
          <div className="nav-links">
            <Link
              to="/register"
              className={isActiveRoute('/register')}
            >
              Register Visitor
            </Link>
            <Link
              to="/visitors"
              className={isActiveRoute('/visitors')}
            >
              Visitors List
            </Link>
            <Link
              to="/dashboard"
              className={isActiveRoute('/dashboard')}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;