// logout.jsx
import React from 'react';

const Logout = () => {
    // remove token from local storage
    localStorage.removeItem('token');
    // redirect to login page
    window.location.href = '/login';
    return (<></>);
}

export default Logout;