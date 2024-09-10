import axios from 'axios';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3000/api/auth/validate-token', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.message === 'Token is valid') {
            console.log('Token is valid');
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            await Swal.fire({
              title: 'Session Expired',
              text: 'Your session has expired. Please log in again.',
              icon: 'error',
              confirmButtonText: 'Login',
            });

            // Use navigate instead of window.location.href
            navigate('/');
          }
        }
      }
    };

    validateToken();
  }, [navigate]); // เพิ่ม navigate ใน dependency array

  const showNavbarSidebarFooter = location.pathname !== '/';

  return (
    <div className="wrapper">
      {showNavbarSidebarFooter && <Navbar />}
      {showNavbarSidebarFooter && <Sidebar />}
      <div className="flex-1 overflow-auto content-wrapper">
        <Outlet />
      </div>
      {showNavbarSidebarFooter && <Footer />}
    </div>
  );
};

export default Layout;
