import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function DetailPatient() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
    email: "",
    address: "",
    medical_history: "",
    current_medications: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    insurance_information: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hn, setHn] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/patients/${id}`
        );
        const patientData = response.data;
        setPatient(patientData);

        // Convert date format to YYYY-MM-DD
        const formattedDateOfBirth = new Date(patientData.date_of_birth)
          .toISOString()
          .split("T")[0];

        setHn(patientData.hospital_number); // Set HN value
        setFormData({
          ...patientData,
          date_of_birth: formattedDateOfBirth,
        });

        // Fetch created_by and updated_by employee details
        const createdByResponse = await axios.get(
          `http://localhost:3000/api/employees/${patientData.created_by}`
        );
        const updatedByResponse = await axios.get(
          `http://localhost:3000/api/employees/${patientData.updated_by}`
        );

        setCreatedBy(createdByResponse.data.first_name);
        setUpdatedBy(updatedByResponse.data.first_name);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleUpdateStatus = async () => {
    // แสดงการยืนยันก่อนทำการอัปเดตสถานะ
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to Restore the patient's status to Active.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore it!',
      cancelButtonText: 'No, cancel!',
    });

    if (result.isConfirmed) {
      try {
        const status = 'Active';
        await axios.put(`http://localhost:3000/api/patients/update-status/${id}`, {
           status,
        });
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Patient status updated to Active",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/inactive-patient");
        });
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Error: ${err.message}`,
          confirmButtonText: "OK",
        });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // This will show date and time
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Detail Patient</h2>
      <form
        onSubmit={(e) => e.preventDefault()} // Prevent form submission
        encType="multipart/form-data"
        className="bg-white shadow-md rounded-lg p-6 border-t-4 border-t-red-500"
        >
        <div className="flex justify-between items-start mb-2 ">
          <div className="border border-gray-300  rounded-lg p-2.5 shadow-md bg-white text-gray-700 font-semibold">
            <span>HN: {hn}</span>
          </div>
          <div className="text-gray-700 font-semibold text-sm text-right grid grid-cols-2 gap-x-4">
            <div>
              <div>Created By: {createdBy}</div>
              <div>Updated By: {updatedBy}</div>
            </div>
            <div>
              <div>Created Date: {formatDate(patient.created_date)}</div>
              <div>Updated Date: {formatDate(patient.updated_date)}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="first_name" className="mb-1 font-semibold">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              placeholder="First Name"
              className="border p-2 rounded"
              disabled // Disable input
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="last_name" className="mb-1 font-semibold">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              placeholder="Last Name"
              className="border p-2 rounded"
              disabled // Disable input
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="date_of_birth" className="mb-1 font-semibold">
              Date of Birth
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              className="border p-2 rounded"
              disabled // Disable input
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="gender" className="mb-1 font-semibold">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              className="border p-2 rounded"
              disabled // Disable select
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone_number" className="mb-1 font-semibold">
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              placeholder="Phone Number"
              className="border p-2 rounded"
              disabled // Disable input
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              className="border p-2 rounded"
              disabled // Disable input
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address" className="mb-1 font-semibold">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              placeholder="Address"
              className="border p-2 rounded"
              disabled // Disable textarea
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="medical_history" className="mb-1 font-semibold">
              Medical History
            </label>
            <textarea
              id="medical_history"
              name="medical_history"
              value={formData.medical_history}
              placeholder="Medical History"
              className="border p-2 rounded"
              disabled // Disable textarea
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="current_medications" className="mb-1 font-semibold">
              Current Medications
            </label>
            <textarea
              id="current_medications"
              name="current_medications"
              value={formData.current_medications}
              placeholder="Current Medications"
              className="border p-2 rounded"
              disabled // Disable textarea
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="emergency_contact_name" className="mb-1 font-semibold">
              Emergency Contact Name
            </label>
            <input
              type="text"
              id="emergency_contact_name"
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              placeholder="Emergency Contact Name"
              className="border p-2 rounded"
              disabled // Disable input
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="emergency_contact_phone" className="mb-1 font-semibold">
              Emergency Contact Phone
            </label>
            <input
              type="text"
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              placeholder="Emergency Contact Phone"
              className="border p-2 rounded"
              disabled // Disable input
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="insurance_information" className="mb-1 font-semibold">
              Insurance Information
            </label>
            <input
              type="text"
              id="insurance_information"
              name="insurance_information"
              value={formData.insurance_information}
              placeholder="Insurance Information"
              className="border p-2 rounded"
              disabled // Disable input
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="status" className="mb-1 font-semibold">
              Status
            </label>
            <input
              type="text"
              id="status"
              name="status"
              value={formData.status}
              placeholder="Status"
              className="border p-2 rounded"
              disabled // Disable input
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => navigate("/inactive-patient")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <i className="fa-solid fa-backward mr-2"></i>
            Back
          </button>
          <button
            type="button"
            onClick={handleUpdateStatus}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            disabled={formData.status === "Active"} // Disable button if already active
          >
            <i className="fa-solid fa-window-restore mr-2"></i>
            Restore Status
          </button>
        </div>
      </form>
    </div>
  );
}

export default DetailPatient;
