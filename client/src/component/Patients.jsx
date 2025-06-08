import axios from "axios";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const patientsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/patients", {
          params: { status: "Active" },
        });
        setPatients(response.data);
        setFilteredPatients(response.data.slice(0, patientsPerPage));
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

  const handleAddPatient = () => navigate("/add-patient");
  const handleEditPatient = (id) => navigate(`/edit-patient/${id}`);
  const handleInactivePatient = () => navigate(`/inactive-patient`);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = patients.filter(
      (p) =>
        p.first_name.toLowerCase().includes(value) ||
        p.last_name.toLowerCase().includes(value) ||
        p.hospital_number.toLowerCase().includes(value)
    );
    setFilteredPatients(filtered.slice(0, patientsPerPage));
    setTotalPages(Math.ceil(filtered.length / patientsPerPage));
    setCurrentPage(1);
  };

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const getPaginationRange = () => {
    const range = [];
    const maxPagesToShow = 2;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, currentPage + 1);
      if (startPage === 1) endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      else if (endPage === totalPages) startPage = Math.max(1, endPage - maxPagesToShow + 1);
      for (let i = startPage; i <= endPage; i++) range.push(i);
      if (startPage > 1) range.unshift("...");
      if (endPage < totalPages) range.push("...");
    }
    return range;
  };

  const genderCount = patients.reduce(
    (acc, p) => {
      if (p.gender === "Male") acc.male++;
      else if (p.gender === "Female") acc.female++;
      return acc;
    },
    { male: 0, female: 0 }
  );

  const genderChartData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [genderCount.male, genderCount.female],
        backgroundColor: ["#3B82F6", "#F472B6"],
        borderWidth: 1,
      },
    ],
  };


  const ageGroups = {
    "0-20": 0,
    "21-40": 0,
    "41-60": 0,
    "61+": 0,
  };

  patients.forEach((p) => {
    const age = calculateAge(p.date_of_birth);
    if (age <= 20) ageGroups["0-20"]++;
    else if (age <= 40) ageGroups["21-40"]++;
    else if (age <= 60) ageGroups["41-60"]++;
    else ageGroups["61+"]++;
  });

  const ageChartData = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        label: "Number of Patients",
        data: Object.values(ageGroups),
        backgroundColor: "#10B981",
      },
    ],
  };

  const ageChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-blue-600">Patient List</h2>
        <div className="flex space-x-2">
          <button onClick={handleAddPatient} className="bg-blue-600 text-white px-4 py-2 rounded">Add Patient</button>
          <button onClick={handleInactivePatient} className="bg-red-600 text-white px-4 py-2 rounded">Inactive Patient</button>
        </div>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name or HN..."
        className="mb-4 p-2 border rounded w-full"
      />

  <div className="flex gap-6 overflow-x-auto">
    
  <div className="w-full md:w-1/3 text-center">
    <h5 className="text-lg font-semibold text-green-600 mb-2">Age Group Distribution (Bar)</h5>
    <div className="h-60">
      <Bar data={ageChartData} options={{ ...ageChartOptions, maintainAspectRatio: false }} />
    </div>
  </div>
  <div className="w-full md:w-1/3 text-center ">
    <h5 className="text-lg font-semibold text-blue-600 mb-2">Gender Summary (Doughnut)</h5>
    <div className="h-60">
      <Doughnut data={genderChartData} options={{ maintainAspectRatio: false }} />
    </div>
  </div>
  {/* Total Patients Card */}
<div className="w-full md:w-1/3">
  <div className="bg-gradient-to-br from-blue-100 to-blue-300 shadow-xl rounded-2xl p-6 h-60 flex flex-col justify-between">
    <div className="flex items-center gap-4">
      <div className="bg-white rounded-full p-3 shadow-md">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <div>
        <p className="text-gray-700 text-sm">Total Patients</p>
        <h2 className="text-4xl font-bold text-blue-900">{patients.length}</h2>
      </div>
    </div>
    <p className="text-sm text-blue-700 text-right mt-4 italic">All active patients in the system</p>
  </div>
</div>

</div>


      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">No</th>
              <th className="py-3 px-4 text-left">Profile Picture</th>
              <th className="py-3 px-4 text-left">HN</th>
              <th className="py-3 px-4 text-left">First Name</th>
              <th className="py-3 px-4 text-left">Last Name</th>
              <th className="py-3 px-4 text-left">Age</th>
              <th className="py-3 px-4 text-left">Phone Number</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient, index) => (
              <tr key={patient.id} className="border-b">
                <td className="py-3 px-4">{(currentPage - 1) * patientsPerPage + index + 1}</td>
                <td className="py-3 px-4">
                  <img
                    src={`http://localhost:3000/uploads/${patient.profile_picture}`}
                    alt="profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </td>
                <td className="py-3 px-4">{patient.hospital_number}</td>
                <td className="py-3 px-4">{patient.first_name}</td>
                <td className="py-3 px-4">{patient.last_name}</td>
                <td className="py-3 px-4">{calculateAge(patient.date_of_birth)}</td>
                <td className="py-3 px-4">{patient.phone_number}</td>
                <td className="py-3 px-4">
                  <button onClick={() => handleEditPatient(patient.id)} className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {getPaginationRange().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default Patients;
