import React, { useState } from 'react';
import "../styles/ComplaintForm.css";
import { useNavigate } from 'react-router-dom';
import { ComplaintAPI } from '../services/api';

// 1. Move categories outside the component to prevent re-renders 
// and ensure they match the Backend Enum exactly.
const COMPLAINT_CATEGORIES = [
  "Roads & Infrastructure",
  "Water Supply",
  "Sanitation & Waste",
  "Street Lighting",
  "Public Safety",
  "Other"
];

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    ward: "",
    location: "",
    category: "",
    description: "",
    photo: null
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image")) {
      alert("Please select an image file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      photo: selectedFile,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.ward.trim()) newErrors.ward = "Ward is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // SAFETY CHECK: If state is somehow stuck on "Roads", we fix it here.
    let submissionCategory = formData.category;
    if (submissionCategory === "Roads") {
        submissionCategory = "Roads & Infrastructure";
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      
      data.append('name', formData.name.trim());
      data.append('ward', formData.ward.trim());
      data.append('location', formData.location.trim());
      data.append('category', submissionCategory); // Sending the corrected string
      data.append('description', formData.description.trim());
      
      if (formData.photo) {
        data.append('photo', formData.photo);
      }

      // Debugging: Log what is actually being sent to the server
      console.log("Submitting category:", submissionCategory);

      const response = await ComplaintAPI.createComplaint(data);
      
      if (response.success || response.data) {
        alert("Complaint submitted successfully!");
        navigate('/my-complaints');
      }

    } catch (error) {
      // Improved error detail extraction
      const serverMsg = error.response?.data?.message || error.message;
      console.error("Submission Error Details:", serverMsg);
      alert(`Submission Failed: ${serverMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="complaint-form-container">
      <div className="complaint-form">
        <h2>Submit a Complaint</h2>
        <p>Report issues in your community for a better CitiSolve experience.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              value={formData.name}
              className={errors.name ? 'error-input' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ward Number</label>
              <input
                type="text"
                name="ward"
                placeholder="e.g. Ward 1"
                onChange={handleChange}
                value={formData.ward}
                className={errors.ward ? 'error-input' : ''}
              />
              {errors.ward && <span className="error-text">{errors.ward}</span>}
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                name="category" 
                onChange={handleChange} 
                value={formData.category}
                className={errors.category ? 'error-input' : ''}
              >
                <option value="">Select Category</option>
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Specific Location</label>
            <input
              type="text"
              name="location"
              placeholder="Street name, Landmark, etc."
              onChange={handleChange}
              value={formData.location}
              className={errors.location ? 'error-input' : ''}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Explain the issue..."
              onChange={handleChange}
              value={formData.description}
              className={errors.description ? 'error-input' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Upload Photo (Optional)</label>
            <div className="file-input-wrapper">
               <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="file-input"
              />
            </div>
            {formData.photo && (
                <div className="photo-preview-info">
                    <p>File selected: <strong>{formData.photo.name}</strong></p>
                </div>
            )}
            <p className="helper-text">Max size: 5MB (JPG, PNG)</p>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => navigate('/my-complaints')}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;