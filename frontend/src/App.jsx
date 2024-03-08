// src/App.js
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'
import Register from './pages/register';
import Logout from './pages/logout';
import Home from './pages/home';
import RecipePage from './pages/recipe';
import Navbar from './components/navbar';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <MantineProvider >
      <Router>
        <div className="App">
          <Navbar />
          
          < div style={{ marginTop: '5rem' } } />
          <Routes>
            
                <Route exact path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recipe/:id" element={<RecipePage />} />
                <Route path="/logout" element={<Logout />} />
              
          </Routes>
        </div>
      </Router>
      
      {/* <ToastContainer /> */}
    </MantineProvider>
  )
}

export default App
