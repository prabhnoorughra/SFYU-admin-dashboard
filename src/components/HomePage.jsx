import { useState, useEffect, useContext, } from 'react'
import { UserContext } from '../App';
import { useNavigate, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorPage from './ErrorPage';
import LoadPage from './LoadPage';


function HomePage() {
    const navigate = useNavigate();
    const {token, changeToken, user} = useContext(UserContext); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(null);
    const [views, setViews] = useState(null);

    const apiURL = import.meta.env.VITE_API_URL;

    useEffect( () => {
        async function fetchApplicantCount() {
            setLoading(true);
            try {
                const response = await fetch(`${apiURL}/application/count`, {
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${token}`},
                });
                if(response.status === 401) {
                    //tokens expired if 401
                    changeToken(null);
                    navigate("/login");
                    return;
                }
                if(response.status >= 500) {
                    throw new Error("Failed to Load Data");
                }
                const data = await response.json();
                setCount(data.count);
                setLoading(false);
            } catch(err) {
                setError(err.message);
                setLoading(false);
            }
        };
        async function fetchViewCount() {
            setLoading(true);
            try {
                const response = await fetch(`${apiURL}/views`, {
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${token}`},
                });
                if(response.status === 401) {
                    //tokens expired if 401
                    changeToken(null);
                    navigate("/login");
                    return;
                }
                if(response.status >= 500) {
                    throw new Error("Failed to Load Data");
                }
                const data = await response.json();
                setViews(data.count);
                setLoading(false);
            } catch(err) {
                setError(err.message);
                setLoading(false);
            }
        };
        if (user && user.role != "ADMIN") {
            navigate("/Unauthorized", { replace: true });
            return;
        }
        if(user && user.role === "ADMIN") {
            fetchApplicantCount();
            fetchViewCount();
        }
    }, [apiURL, changeToken, navigate, token, user]);


    if(loading) {
        //render loadpage
        return (
            <LoadPage message={"Loading..."}/>
        );
    }

    if(error) {
        //render errorpage
        return (
            <ErrorPage message={error}/>
        );
    }



    return(
        <>
            {!user && !token && (
                <div className="h-100 bg-light">
                    <div className='h-75 d-flex justify-content-center align-items-center display-1'>
                        Please Login.
                    </div>
                </div>
            )}
            {user && user.role === "ADMIN" && (
                <div className='h-100 bg-light'>
                    <div className="h-75 display-2 d-flex flex-column align-items-center gap-5 pt-5">
                        <div>Welcome Back</div>
                        <div>Applicants: {count}</div>
                        <div>Views: {views}</div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HomePage