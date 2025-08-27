import { useState, useEffect, useContext, } from 'react'
import { UserContext } from '../App';
import { useNavigate, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';


function LoginPage() {
    const {token, changeToken} = useContext(UserContext); 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const apiURL = import.meta.env.VITE_API_URL;

   if(token != null) {
    return (<Navigate to="/" replace />);
   }

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${apiURL}/adminlogin`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            if(!response.ok) {
                //even if user is entering valid credentials but isn't admin or one
                //of the username/password is correct we do not tell them to maintain security
                setError("Incorrect Username or Password");
                return;
            }
            const data = await response.json();
            const {token} = data;
            changeToken(token);
        } catch(err){
            console.log(err);
        }
    }
    return (
    <>
        <div className='home vh-100 bg-light'>
            <div className='p-3 h-75'>
                <div className="row justify-content-center align-items-center">
                    {error && (
                        <ul className='list-group text-center w-25 align-items-center fs-6'>
                            <li className='list-group-item list-group-item-warning'>
                                {error}
                            </li>
                        </ul>
                    )}
                </div>
                <form onSubmit={handleLogin}>
                    <div className="row mb-3 justify-content-center">
                        <div className="col-md-10">
                            <label htmlFor="email" className="form-label col-form-label-lg">Email</label>
                            <input className='form-control form-control-lg'
                            type="email" placeholder="Email" required id='email'
                            onChange={e => setUsername(e.target.value)} value={username}/>
                        </div>
                    </div>
                    <div className="row mb-3 justify-content-center">
                        <div className="col-md-10">
                            <label htmlFor="password" className="form-label col-form-label-lg">Password</label>
                            <input className='form-control form-control-lg'
                            type="password" placeholder="Password" required id='password'
                            onChange={e => setPassword(e.target.value)} value={password}/>
                        </div>
                    </div>
                    <div className="row mb-3 justify-content-center text-center">
                        <div className="col-md-3">
                            <button type='submit' className='btn btn-primary btn-lg'>Log In</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
    );
}

export default LoginPage