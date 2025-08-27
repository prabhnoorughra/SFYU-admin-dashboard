import App from "./App";
import ErrorPage from "./components/ErrorPage"
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SearchPage from "./components/SearchPage";




const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {path: "login",  element: <LoginPage />},
            {path: "search", element: <SearchPage />},
        ],
    },
    {
        path: "*", 
        element: <ErrorPage />,
    },
];

export default routes