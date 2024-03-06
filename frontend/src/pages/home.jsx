// home.jsx
import React from 'react';

function Home() {
    // will check if there is token in local storage 
    // if not, redirect to login page
    if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined){
        window.location.href = '/login';
    }

    return (
        <div>
            <h1>Welcome to Home Page</h1>
        </div>
    );
}

export default Home;