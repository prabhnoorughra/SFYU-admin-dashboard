import { Link } from "react-router-dom";



function ErrorPage({message}) {
    return(
        <div className="d-flex display-1 align-items-center justify-content-center h-75 text-danger flex-column">
            Error: {message || "Page Not Found."}
            <Link className="text-warning"
                to="/">Go Back Home</Link>
        </div>
    );
}

export default ErrorPage