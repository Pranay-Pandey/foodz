import React, { useState } from "react";
import { Paper, Grid, TextInput, Button, Container, Center, PasswordInput } from '@mantine/core';
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';

const Login = () => {
  // if token in local storage, redirect to home
  if (localStorage.getItem('token') !== null) {
    window.location.href = '/'
  }

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
    // Add loading to the body
    document.body.classList.add('loading'); 
    const data = new FormData(e.target)
    const hashedPassword = CryptoJS.SHA256(data.get('password')).toString(CryptoJS.enc.Hex)
    data.set('password', hashedPassword)
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
        localStorage.setItem('firstName', data.firstName)
        localStorage.setItem('lastName', data.lastName)
        localStorage.setItem('email', data.email)
        localStorage.setItem('user_id', data.user_id)

        window.location.href = '/';
      }).catch((error) => {
        toast.error(`${error}`)
      }).finally(() => {
        document.body.classList.remove('loading');
      })
  }

  return (
    <Container size="xs" mt={100}>
      <Paper p="50" radius="lg" shadow="xs">
        <Center>
          <h1>Login</h1>
        </Center>
        <form onSubmit={handleSubmit}>
          <Grid gutter="md" justify="center">
            <Grid.Col span={12}>
              <TextInput
                label="Email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <PasswordInput
                label="Password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Button fullWidth type="submit">Submit</Button>
            </Grid.Col>
          </Grid>
          <p className="forgot-password text-right">
            No account? <a href="/register">Signup</a>
          </p>
        </form>
      </Paper>
      <ToastContainer />
    </Container>
  )
}

export default Login;
