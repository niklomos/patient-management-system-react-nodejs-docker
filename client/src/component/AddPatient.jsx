import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AddPatient() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    email: '',
    address: '',
    medical_history: '',
    current_medications: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    insurance_information: '',
    created_by: '', // Add created_by field
    updated_by: '', // Add updated_by field
  });
  const [profilePicture, setProfilePicture] = useState(null); // State for file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const empId = localStorage.getItem("empId");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Add empId to created_by and updated_by fields
    const updatedFormData = {
      ...formData,
      created_by: empId,
      updated_by: empId,
    };

    // Create a new FormData instance
    const data = new FormData();
    Object.keys(updatedFormData).forEach(key => {
      data.append(key, updatedFormData[key]);
    });
    if (profilePicture) {
      data.append('profile_picture', profilePicture); // Append the file
    }

    try {
      const response = await axios.post('http://localhost:3000/api/patients', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type
        },
      });
      setLoading(false);
      
      if (response.status === 201) { // Check if the status is 201 (Created)
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Patient added successfully',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/patients'); // Navigate to the patients list page after success
        });
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Error: ${err.message}`,
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Add New Patient</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Medical History</label>
            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              placeholder="Medical History"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Current Medications</label>
            <textarea
              name="current_medications"
              value={formData.current_medications}
              onChange={handleChange}
              placeholder="Current Medications"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Emergency Contact Name</label>
            <input
              type="text"
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
              placeholder="Emergency Contact Name"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Emergency Contact Phone</label>
            <input
              type="text"
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handleChange}
              placeholder="Emergency Contact Phone"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Insurance Information</label>
            <textarea
              name="insurance_information"
              value={formData.insurance_information}
              onChange={handleChange}
              placeholder="Insurance Information"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Profile Picture</label>
            <input
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <button
          type="submit"
          className={`mt-4 px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white`}
          disabled={loading}
        >
       <i className="fa-solid fa-plus mr-2"></i>
          {loading ? 'Submitting...' : 'Add Patient'}
        </button>
      </form>
    </div>
  );
}

export default AddPatient;
