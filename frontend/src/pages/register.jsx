import React, {useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/register`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.status === 500 || response.status === 409) {
          return response.json().then((data) => {
            throw new Error(data.error)
           })
        }
        if (response.status === 400) {
          throw new Error("Please fill the form correctly")
        }
        return response.json()
      })
      .then((data) => {
        if (data.token === undefined) {
          throw new Error('Invalid credentials')
        }
        alert('Registration successful')
        window.location.href = '/login';
      }).catch((error) => {
        toast.error(`${error}`)
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Register</h3>

      <div className="mb-3">
        <label>First name</label>
        <input
          id="firstName"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          type="text"
          className="form-control"
          placeholder="First name"
          required
        />
      </div>

      <div className="mb-3">
        <label>Last name</label>
        <input type="text" 
        id="lastName"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        className="form-control" 
        placeholder="Last name" 
        required
        />
      </div>

      <div className="mb-3">
        <label>Email address</label>
        <input
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="form-control"
          placeholder="Enter email"
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          className="form-control"
          placeholder="Enter password"
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered? <a href="/login">login</a>
      </p>
     <ToastContainer />
    </form>
  )
}

export default Register;