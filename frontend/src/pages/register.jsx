import React, { useState } from "react";
import { Paper, Grid, TextInput, Button, Container, Center, PasswordInput } from '@mantine/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';

const Register = () => {
  // if token in local storage, redirect to home
  if (localStorage.getItem('token') !== null) {
    window.location.href = '/'
  }
  
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add loading to the body
    document.body.classList.add('loading');
    var derived_key = CryptoJS.enc.Base64.parse(`${import.meta.env.VITE_ENCRYPTION_KEY}`)
    var iv = CryptoJS.enc.Utf8.parse(`${import.meta.env.VITE_ENCRYPTION_IV}`);
    var hashedPassword = CryptoJS.AES.encrypt(form.password, derived_key, {iv: iv, mode: CryptoJS.mode.CBC}).toString();
    const registerForm = { firstName: form.firstName, lastName: form.lastName, email: form.email, password: hashedPassword };
    fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/register`, {
      method: 'POST',
      body: JSON.stringify(registerForm),
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
        window.location.href = '/login';
      }).catch((error) => {
        toast.error(`${error}`)
      }).finally(() => {
        document.body.classList.remove('loading');
      })
  }


  return (
    <Container size="xs" >
      <Paper p="50" radius="lg" shadow="xs">
        <Center>
          <h1>Register</h1>
        </Center>
        <form onSubmit={handleSubmit}>
          <Grid gutter="md" justify="center">
            <Grid.Col span={12}>
              <TextInput
                label="First Name"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Last Name"
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </Grid.Col>
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
              <Button fullWidth type="submit">Sign Up</Button>
            </Grid.Col>
          </Grid>
          <p className="forgot-password text-right">Already registered? <a href="/login">login</a></p>
        </form>
      </Paper>
      <ToastContainer />
    </Container>
  )
}

export default Register;
