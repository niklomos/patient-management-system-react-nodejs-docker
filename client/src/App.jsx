import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AddPatient from './component/AddPatient';
import DetailPatient from './component/DeailPatient';
import EditPatient from './component/EditPatient';
import InactivePatients from './component/InactivePatients';
import Layout from './component/layout/Layout';
import Login from './component/Login';
import Patients from './component/Patients';
import ProtectedRoute from './component/ProtectedRoute';
import Register from './component/Register';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
        <Route path="/patients" element={<ProtectedRoute element={Patients} />} />
        <Route path="/add-patient" element={<ProtectedRoute element={AddPatient} />} />
        <Route path="/edit-patient/:id" element={<ProtectedRoute element={EditPatient} />} />
        <Route path="/inactive-patient" element={<ProtectedRoute element={InactivePatients} />} />
        <Route path="/detail-patient/:id" element={<ProtectedRoute element={DetailPatient} />} />
        </Route>
      </Routes>
    </Router>
  );
  
}


export default App;
