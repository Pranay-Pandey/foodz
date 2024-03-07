import React, {useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GridLoader from "react-spinners/GridLoader";

const loaderStyle = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  filter: "none",
  position: "absolute",
  left: "45%",
};

const Login = () => {
  // if token in local storage, redirect to home
  if (localStorage.getItem('token') !== null) {
    window.location.href = '/'
  }

  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#00ff00");

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // handle on form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    document.querySelector('body').style.filter = 'blur(5px)'
    setLoading(true)
    const data = new FormData(e.target)
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
      method: 'POST',
      body: data,
    })
      .then((response) => 
      {
        if (response.status === 400 || response.status === 404) {
           return response.json().then((data) => {
            throw new Error(data.error)
           })
        }
        return response.json()
      })
      .then((data) => {
        if (data.token === undefined) {
          throw new Error('Invalid credentials')
        }
        // set token in local storage with expiry of 1 minute
        localStorage.setItem('token', data.token)
        window.location.href = '';
      }).catch((error) => {
        toast.error(`${error}`)
      }).finally(() => {
        setLoading(false)
        document.querySelector('body').style.filter = 'none'
      })
  }

    return (
      <div className="auth-wrapper">
      <div className="auth-inner">
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>
        
        <GridLoader
        color={color}
        loading={loading}
        cssOverride={loaderStyle}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter password"
            required
          />
        </div>

        {/* <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div> */}

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="forgot-password text-right">
          No account? <a href="/register">Signup</a>
        </p>
        <ToastContainer />
      </form>
      
      </div>
      </div>
    )
}

export default Login