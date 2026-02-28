// // 1. Update this to your local port for development
// const baseURL = 'http://localhost:5000/api';

// const getToken = () => {
//     const token = localStorage.getItem("token");
//     // Only log if the token status changes to keep the console clean
//     return token;
// }

// const callAPI = async (endpoint, options = {}) => {
//     const token = getToken();
    
//     // Create headers without pre-setting Content-Type
//     const headers = { ...options.headers };
    
//     if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//     }

//     // CRITICAL: If sending FormData, the browser MUST set the Content-Type 
//     // and Boundary itself. Do not set 'Content-Type': 'multipart/form-data' manually.
//     if (options.body instanceof FormData) {
//         delete headers['Content-Type'];
//     }

//     const config = {
//         ...options,
//         headers: headers
//     };

//     try {
//         const response = await fetch(`${baseURL}${endpoint}`, config);
//         const data = await response.json().catch(() => ({}));

//         if (!response.ok) {
//             // Throw the specific server message (like Enum validation errors)
//             throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
//         }
        
//         return data;

//     } catch (error) {
//         console.error("API Call Error:", error.message);
//         throw error;
//     }
// }

// export const authAPI = {
//     register: (userData) => {
//         return callAPI("/auth/register", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(userData),
//         });
//     },
//     login: (loginData) => {
//         return callAPI('/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(loginData),
//         });
//     }
// };

// export const ComplaintAPI = {
//     createComplaint: (complaintData) => {
//         const isFormData = complaintData instanceof FormData;
        
//         return callAPI('/complaints', {
//             method: 'POST',
//             // If it's FormData (for photos), send as-is. Otherwise, stringify.
//             body: isFormData ? complaintData : JSON.stringify(complaintData),
//             headers: isFormData ? {} : { 'Content-Type': 'application/json' }
//         });
//     },
//     // This allows Priyanka to see her specific reports
//     getComplaints: () => {
//         return callAPI('/complaints', {
//             method: 'GET'
//         });
//     }
// };
const baseURL = 'http://localhost:5000/api';

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