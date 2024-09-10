import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');

  return (
    token ? <Component /> : <Navigate to="/" />
  );
};

// ใช้ PropTypes เพื่อกำหนดประเภทของ props
ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired
};

export default ProtectedRoute;
