import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/employees/login', {
        email,
        password,
      });

      // เก็บ token และ name ใน localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('firstName', response.data.empName);     
      localStorage.setItem('empId', response.data.empId);
 

      // แจ้งเตือนการล็อกอินสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'Login successful',
        text: 'You have logged in successfully!',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        // นำทางไปยังหน้า Home
        navigate('/patients');
      });

    } catch (error) {
      // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 p-2 ">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 border border-blue-300 ">
          <h3 className="text-3xl font-extrabold text-blue-600 text-center mb-8">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-gray-800 text-lg font-semibold mb-2">Email </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-blue-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-800 text-lg font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-blue-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
            <div className="text-center mt-5">
              <Link to="/register" className="text-blue-600 hover:text-blue-800">
                Not a staff member? Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
