import { useState, useEffect, useContext, useCallback, } from 'react'
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadPage from './LoadPage';
import ErrorPage from './ErrorPage';


function SearchPage() {
    const navigate = useNavigate();
    const {token, changeToken} = useContext(UserContext); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [studyYear, setStudyYear] = useState(null);
    const [emailConsent, setEmailConsent] = useState(null);
    const [query, setQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);

    const apiURL = import.meta.env.VITE_API_URL;
    const take = 20;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const baseURL = `${apiURL}/application`;

            const options =
                `?page=${page}` +
                `&take=${take}` +
                (studyYear ? `&studyYear=${encodeURIComponent(studyYear)}` : "") +
                (typeof emailConsent === "boolean" ? `&emailConsent=${emailConsent}` : "") +
                (query ? `&search=${encodeURIComponent(query)}` : "");

            const finalURL = baseURL + options;
            const response = await fetch(finalURL, {
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
                throw new Error("Failed to Load Posts");
            }
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch(err) {
            setError(err.message);
            setLoading(false);
        }
    }, [apiURL, token, changeToken, navigate, page, query, emailConsent, studyYear]);

    async function handleSubmit(e) {
        e.preventDefault();
        setPage(1);
        setQuery(searchTerm);
    }


    useEffect(() => {
        fetchData();
    }, [page, studyYear, emailConsent, query, fetchData])

    function changeStudyYear(year) {
        setStudyYear(year);
        setPage(1);
    }
    function changeEmailConsent(setting) {
        setEmailConsent(setting);
        setPage(1);
    }


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
        <div className='flex-grow-1 d-flex flex-column h-100'>
            <nav className="searchNav navbar navbar-light bg-light justify-content-center">
                <div className="nav-item dropdown mb-2 mb-md-0 ms-0 ms-sm-5">
                    <button className="btn btn-primary dropdown-toggle me-2"
                    type="button" id="dropdownMenuButton"
                    data-bs-toggle="dropdown">
                        Study Year
                    </button>
                    <div className="dropdown-menu">
                        <button className={`dropdown-item btn btn-link ${studyYear === "First" ? "active" : ""}`}
                            onClick={() => changeStudyYear("First")}>
                            First
                        </button>
                        <button className={`dropdown-item btn btn-link ${studyYear === "Second" ? "active" : ""}`}
                            onClick={() => changeStudyYear("Second")}>
                            Second
                        </button>
                        <button className={`dropdown-item btn btn-link ${studyYear === "Third" ? "active" : ""}`}
                            onClick={() => changeStudyYear("Third")}>
                            Third
                        </button>
                        <button className={`dropdown-item btn btn-link ${studyYear === "Fourth" ? "active" : ""}`}
                            onClick={() => changeStudyYear("Fourth")}>
                            Fourth
                        </button>
                        <button className={`dropdown-item btn btn-link ${studyYear === "Fifth+" ? "active" : ""}`}
                            onClick={() => changeStudyYear("Fifth+")}>
                            Fifth+
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className={`dropdown-item btn btn-link ${studyYear === null ? "active" : ""}`}
                            onClick={() => changeStudyYear(null)}>
                            All
                        </button>
                    </div>
                </div>
                <div className="nav-item dropdown mb-2 mb-md-0">
                    <button className="btn btn-primary dropdown-toggle me-sm-4"
                    type="button" id="dropdownMenuButton"
                    data-bs-toggle="dropdown">
                        Emails
                    </button>
                    <div className="dropdown-menu">
                        <button className={`dropdown-item btn btn-link ${emailConsent === true ? "active" : ""}`}
                            onClick={() => changeEmailConsent(true)}>
                            On
                        </button>
                        <button className={`dropdown-item btn btn-link ${emailConsent === false ? "active" : ""}`}
                            onClick={() => changeEmailConsent(false)}>
                            Off
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className={`dropdown-item btn btn-link ${emailConsent === null ? "active" : ""}`}
                            onClick={() => changeEmailConsent(null)}>
                            All
                        </button>
                    </div>
                </div>
                <form className="form-inline row g-2 align-items-center justify-content-center flex-grow-1" onSubmit={handleSubmit}>
                    <div className="col-10 col-sm-6">
                        <input className="form-control me-sm-2" type="search" placeholder="Search" value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                    <div className="col-auto d-flex justify-content-center">
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
                            Search
                        </button>
                         <button className="btn btn-outline-danger my-2 my-sm-0 me-0 ms-2" type="button"
                                onClick={() => {
                                    setQuery('');
                                    setSearchTerm('');
                                    setEmailConsent(null);
                                    setStudyYear(null);
                                    setPage(1);
                                }}>
                                Clear Search
                        </button>
                    </div>
                </form>
            </nav>
            <div className='flex-grow-1 overflow-auto bg-light' style={{ minHeight: 0 }}>
                <div className='searchPage p-2 container-fluid d-flex'>
                    {data === null && (
                        <div className='display-2 row col-12 justify-content-center'>
                            Please search for Applications!
                        </div>
                    )}
                    {data && data.applications.length === 0 && (
                        <div className='display-2 row col-12 justify-content-center'>
                            No Results!
                        </div>
                    )}
                    {data && data.applications.length != 0 &&
                        <div className="searchResults row row-cols-1 row-cols-sm-2 row-cols-md-3
                        gy-3 gx-3 overflow-y-auto w-100">
                            {data.applications.map(app => {
                                return (
                                    <div className="col">
                                        <div className="card h-100 bg-light text-dark" 
                                            style={{minHeight: "20vh"}}>
                                            <div key={app.id} className='card-body d-flex flex-column justify-content-between'>
                                                <div className='card-title text-center fs-4 fw-bolder'>
                                                    {app.fullName}
                                                </div>
                                                <div className='card-subtitle row'>
                                                    <span className='col-12 col-sm-6 text-center'>{app.email}</span>
                                                    <span className='col-12 col-sm-6 text-center'>{app.studentId}</span>
                                                </div>
                                                <div className='card-text text-center'>
                                                    {app.program}
                                                </div>
                                                <div className='card-text d-flex justify-content-center gap-3'>
                                                    <span>Year: {app.studyYear}</span>
                                                    <span>Emails: {app.emailConsent ? "On" : "Off"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    }
                </div>
            </div>
            <div className="pagination mt-auto justify-content-center bg-light py-2">
                 {data && (
                    <div className={`page-item ${page <= 1 ? "disabled" : ""}`}
                        onClick={() => {
                            if(page > 1) {
                                setPage(page - 1);
                            }
                            if(page < 1 && data.pagination.totalPages >= 1) {
                                setPage(1);
                            }
                        }}>
                        <a className="page-link btn btn-link">Prev</a>
                    </div>
                 )}
                 {data && page === data.pagination.totalPages && page - 2 > 0 && (
                    <div className='page-item'
                        onClick={() => setPage(page - 2)}> 
                        <a className="page-link btn btn-link">{page - 2}</a>
                    </div>
                 )}
                 {data && page != 1 && page - 1 > 0 && (
                    <div className='page-item'
                        onClick={() => setPage(page - 1)}> 
                        <a className="page-link btn btn-link">{page - 1}</a>
                    </div>
                 )}
                 {page != null && data && (
                    <div className='page-item'>
                        <a className="page-link btn btn-link active">{page}</a>
                    </div>
                 )}
                 {data && page + 1 <= data.pagination.totalPages && (
                    <div className='page-item'
                        onClick={() => setPage(page + 1)}> 
                        <a className="page-link btn btn-link">{page + 1}</a>
                    </div>
                 )}
                 {data && page === 1 && page + 2 <= data.pagination.totalPages && (
                    <div className='page-item'
                        onClick={() => setPage(page + 2)}> 
                        <a className="page-link btn btn-link">{page + 2}</a>
                    </div>
                 )}
                 {data && (
                    <div className={`page-item ${page >= data.pagination.totalPages ? "disabled" : ""}`}
                        onClick={() => {
                            if(page < data.pagination.totalPages) {
                                setPage(page + 1);
                            }
                        }}>
                        <a className="page-link btn btn-link">Next</a>
                    </div>
                 )}
            </div>
        </div>
    );
}

export default SearchPage