import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice"; 

function Navbar() {
    const user = useSelector((store) => store.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const username = user ? user.username : "Guest";



    // logout functionality

    function handleLogout() {
        if (user) {
            try {
                axios.post(
                    "http://127.0.0.1:8000/logout",
                    {},
                    {
                        headers: {
                            Authorization: `Token ${user.token}`,
                        },
                    }
                );
                dispatch(logout());  
                alert("Logged out successfully");
                navigate("/");
            } catch (error) {
                console.error("Logout error:", error);
            }
        }
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-warning rounded ">
            <div className="navbar-brand">
                <h1 className="text-danger">Hi <span style={{textTransform:'uppercase'}}>{username}</span></h1>
            </div>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className="collapse navbar-collapse mr-auto"
                id="navbarNav"
                style={{ float: "left" }}
            >
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                   

                    <li className="nav-item">
                        <NavLink style={{fontSize:'18px'}} className="nav-link text-dark" onClick={handleLogout}>
                            LogOut
                        </NavLink>
                    </li>

                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
