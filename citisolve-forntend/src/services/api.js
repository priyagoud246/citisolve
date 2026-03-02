
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem("token");

const callAPI = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = { ...options.headers };
    
    if (token) headers['Authorization'] = `Bearer ${token}`;

    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const config = { ...options, headers };

    try {
        const response = await fetch(`${baseURL}${endpoint}`, config);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || `Error ${response.status}`);
        return data;
    } catch (error) {
        console.error("API Call Error:", error.message);
        throw error;
    }
};

export const authAPI = {
    register: (userData) => callAPI("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    }),
    login: (loginData) => callAPI('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
    })
};

export const ComplaintAPI = {
    createComplaint: (complaintData) => {
        const isFormData = complaintData instanceof FormData;
        return callAPI('/complaints', {
            method: 'POST',
            body: isFormData ? complaintData : JSON.stringify(complaintData),
            headers: isFormData ? {} : { 'Content-Type': 'application/json' }
        });
    },
    getComplaints: () => callAPI('/complaints', { method: 'GET' }),
    
    // THE MISSING FUNCTION
    updateStatus: (id, status) => callAPI(`/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    })
};