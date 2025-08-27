import { useState, useEffect, useContext, } from 'react'
import { UserContext } from '../App';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const {token, changeToken, user} = useContext(UserContext); 

    function handleLogOut() {
        localStorage.removeItem("token");
        changeToken(null);
        navigate("/");
    }

    return (
        <nav className='navbar navbar-light px-4 bg-secondary flex-column flex-sm-row 
        justify-content-center text-center justify-content-sm-start text-sm-start'>
            <div className='navbar-brand fs-2 cursor-pointer btn btn-link text-white' 
            onClick={() => navigate("/")}>
                Admin Dashboard
            </div>
            {!token && location.pathname != "/login" && (
                <button className="btn btn-primary text fs-5 ms-sm-auto"
                onClick={() => navigate("/login")}>Log In</button>
            )}
            {token && (
                <div className='buttons ms-sm-auto'>
                    <button className='btn btn-info text fs-5 me-1 me-lg-2 mb-2 mb-sm-0'
                        onClick={() => navigate("/search")}>View Applications
                    </button>
                    <button className="btn btn-danger text fs-5 mb-2 mb-sm-0"
                    onClick={handleLogOut}>Log Out</button>
                </div>
            )}
        </nav>
    );
}

export default NavBar