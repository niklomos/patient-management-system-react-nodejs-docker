import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InactivePatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const patientsPerPage = 5; // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const status = 'Inactive'
        const response = await axios.get('http://localhost:3000/api/patients',{
          params:{status}
        });
        setPatients(response.data);
        setFilteredPatients(response.data);
        setTotalPages(Math.ceil(response.data.length / patientsPerPage));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * patientsPerPage;
    const endIndex = startIndex + patientsPerPage;
    setFilteredPatients(patients.slice(startIndex, endIndex));
  }, [currentPage, patients]);

  const handleDetailPatient = (id) => {
    navigate(`/detail-patient/${id}`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    const filtered = patients.filter((patient) =>
      patient.first_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(event.target.value.toLowerCase()) ||
      patient.hospital_number.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPatients(filtered);
    setTotalPages(Math.ceil(filtered.length / patientsPerPage));
    setCurrentPage(1); // Reset to the first page on new search
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const range = [];
    const maxPagesToShow = 2; // Show 2 page numbers
  
    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to maxPagesToShow, show all
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Calculate the start and end page to show
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, currentPage + 1);
  
      // Adjust if pages go out of bounds
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
  
      // Add range of pages
      for (let i = startPage; i <= endPage; i++) {
        range.push(i);
      }
  
      // Add ellipses if needed
      if (startPage > 1) {
        range.unshift('...'); // Add ellipsis at the start if necessary
      }
      if (endPage < totalPages) {
        range.push('...'); // Add ellipsis at the end if necessary
      }
    }
  
    return range;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-red-600">Inactive Patient List</h2>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name or HN..."
        className="mb-4 p-2 border rounded w-full"
      />
              <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="text-left py-3 px-4">No</th>
            <th className="text-left py-3 px-4">Profile Picture</th>
            <th className="text-left py-3 px-4">HN</th>
            <th className="text-left py-3 px-4">First Name</th>
            <th className="text-left py-3 px-4">Last Name</th>
            <th className="text-left py-3 px-4">Age</th>
            <th className="text-left py-3 px-4">Phone Number</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient, index) => (
            <tr key={patient.id} className="border-b">
              <td className="py-3 px-4">{(currentPage - 1) * patientsPerPage + index + 1}</td>
              <td className="py-3 px-4">
                <img
                  src={`http://localhost:3000/uploads/${patient.profile_picture}`}
                  alt={`${patient.first_name} ${patient.last_name}`}
                  className="w-12 h-12 object-cover rounded-full"
                />
              </td>
              <td className="py-3 px-4">{patient.hospital_number}</td>
              <td className="py-3 px-4">{patient.first_name}</td>
              <td className="py-3 px-4">{patient.last_name}</td>
              <td className="py-3 px-4">{calculateAge(patient.date_of_birth)}</td>
              <td className="py-3 px-4">{patient.phone_number}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleDetailPatient(patient.id)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="flex justify-center items-center mt-4">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 mx-1"
  >
    Previous
  </button>
  <div className="flex items-center">
    {getPaginationRange().map((item, index) => (
      item === '...' ? (
        <span key={index} className="mx-1 text-gray-600">...</span>
      ) : (
        <button
          key={item}
          onClick={() => handlePageChange(item)}
          className={`mx-1 px-4 py-2 rounded ${currentPage === item ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'} hover:bg-red-500`}
        >
          {item}
        </button>
      )
    ))}
  </div>
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 mx-1"
  >
    Next
  </button>
</div>

    </div>
  );
}

export default InactivePatients;
