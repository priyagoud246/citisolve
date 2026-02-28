import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Register.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'


const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: '',
        password: '',
        confirmPassword: '',
        role: "Citizen"
    })

    const handleChange = (e) => {
        //update the formdata with the user input values
        //when we type something we sholud see it on the form
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setErrors(prev => ({
            ...prev, [e.target.name]: ""
        }))
    }
    //validations
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}
        if (formData.name.trim() === "") {
            newErrors.name = "Name is required"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters long"
        }
        //email
        if (formData.email.trim() === '') {
            newErrors.email = "Email is required"
        }
        //password
        if (formData.password.trim() === '') {
            newErrors.password = "Password is required"
        } else if (formData.password.trim().length < 6) {
            newErrors.password = "Password must be at least 6 characters long"
        }

        //confirm password
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0; //returns true when there are no errors
    }
    const { login } = useAuth();
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
         setErrorMessage('');
        if (!validateForm()) return;
        setIsLoading(true)
       
        
        //send the data to the backend database
        try {
            const response = await authAPI.register({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            role: formData.role,
        })
        console.log(response)
        localStorage.setItem('token',response.token)
        localStorage.setItem('userRole',response.role)
        localStorage.setItem('userName',response.name)
        localStorage.setItem('userId',response._id)

        login(formData.name);
        navigate('/');
            
        } catch (error) {
            console.log(error.message)
            setErrorMessage(error.message)
        }finally{
            setIsLoading(false)
        }
        
    }
    return (
        <div className='register-container'>
            <div className="register-card" >
                <h2>Create Account</h2>
                <p className="register-subtitle">Join our citizen resolution system</p>
              
                 {errorMessage && <div className='error-message'>{errorMessage}</div>}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        {/* name */}
                        <label>Full Name</label>
                        <input type="text" placeholder='Enter your full name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange} />

                        {errors.name && <span className='error'>{errors.name}</span>}
                    </div>


                    {/* email */}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type='email' placeholder='Enter your email address'
                            name="email"
                            value={formData.email}
                            onChange={handleChange} />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>


                    {/* role */}
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}>
                            <option value="Citizen">Citizen</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>


                    {/* password */}
                    <div className="form-group">
                        <label>Password</label>
                        <input type='password' placeholder='Enter your password'
                            name="password"
                            value={formData.password}
                            onChange={handleChange} />

                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>


                    {/* confirmPassword */}
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input type='password' placeholder='Confirm your password'
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange} />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>

                    <button>{isLoading ? "creating Account...": "Create Account"}</button>
                </form>
                <div className="login-link">
                    <p>Already have an account?</p>
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    )
}

export default Register
