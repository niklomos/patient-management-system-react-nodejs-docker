import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const firstName = localStorage.getItem("firstName");
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 bg-gray-800 text-white">
      {/* Brand Logo */}
      <a href="#" className="brand-link ">
        <img
          src="../../dist/img/logo-hp2.png"
          alt="AdminLTE Logo"
          className="brand-image"
          style={{ opacity: ".8" }}
        />
        <span className="brand-text pe-10 text-lg bg-gradient-to-r from-red-400 via-yellow-400 to-purple-600 bg-clip-text text-transparent uppercase">
        Patient Management
        </span>
      </a>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 ">
          <div className="image">
            <img
              src="../../dist/img/avatar4.png"
              className="img-circle elevation-2"
              alt="User Image"
            />
          </div>
          <div className="info ml-3">
            <a
              href="#"
              className="d-block text-white font-medium hover:text-gray-300 transition-colors"
            >
              {firstName}
            </a>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            {/* Orders Menu */}
          

            {/* Products Menu */}
            <li className="nav-item">
              <NavLink
                to="/patients"
                className={({ isActive }) =>
                  `nav-link flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors ${
                    isActive ||
                    location.pathname.includes("add-patient") ||
                    location.pathname.includes("inactive-patient") ||
                    location.pathname.match(/^\/edit-patient\/\d+/) ||
                    location.pathname.match(/^\/detail-patient\/\d+/)
                      ? "bg-gray-700"
                      : ""
                  }`
                }
              >
                <i
                  className="nav-icon fa-solid fa-hospital-user mr-3 bg-gradient-to-r from-red-400 via-yellow-400 to-purple-600 
        bg-clip-text text-transparent"
                ></i>
                <p className="text">Patient</p>
              </NavLink>
            </li>

            {/* Important Menu */}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
