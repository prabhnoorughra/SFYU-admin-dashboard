import { useState, useEffect, createContext, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as jwtDecode from 'jwt-decode';
import './App.css'
import NavBar from './components/NavBar';

export const UserContext = createContext({
  token: null,
  user: null,
  changeToken: () => {},
});

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    if(token === null) {
      return null;
    } else {
      try {
        return jwtDecode.jwtDecode(token);
      } catch {
        return null;
      }
    }
  });

  useEffect(() => {
    if (token === null) {
      setUser(null);
      localStorage.removeItem("token");
      return;
    } else {
      try {
        const decoded = jwtDecode.jwtDecode(token);
        localStorage.setItem("token", token);
        setUser(decoded);
        console.log(decoded);
      } catch(err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  }, [token, setToken, setUser]);

  useEffect(() => {
    if (!user || !user.exp) {
      return;
    }
    const now = Date.now() / 1000;
    if (now >= user.exp) {
        // token has expired
        setToken(null);
        localStorage.removeItem("token");
    }
  }, [user]);


  const changeToken = (token) => {
    setToken(token);
  }

  return (
    <div className='d-flex flex-column vh-100'>
      <UserContext.Provider value={{token, changeToken, user}}>
        <NavBar />
        <div className="flex-grow-1 overflow-hidden"><Outlet/></div>
      </UserContext.Provider>
    </div>
  )
}

export default App
