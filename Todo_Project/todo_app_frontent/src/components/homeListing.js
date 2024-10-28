import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link, Navigate } from "react-router-dom"; 
import { useSelector } from "react-redux"; 
import './Home.css'; 

function Home() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const user = useSelector((state) => state.auth.user); 
    const [createProjectModel, setCreateProjectModel] = useState(false);
    const [newTitle, setNewTitle] = useState('');


    useEffect(() => {
        if (user && user.token) {
            fetchProjects();
        } else {
            console.error("User is not authenticated");
        }
    }, [user]); 


// creating a project

    const handleCreateProject = () => {
        axios.post(`http://localhost:8000/projects/create`, {
            title:newTitle,
        }, {
            headers: { 'Authorization': `Token ${user.token}` }
        })
        .then(response => {
            fetchProjects();
            setCreateProjectModel(false)
            alert("Project created successfully")

        })
        .catch(error => {
            console.error('Error creating todo:', error);
        });
    };



//listing all rojects

    const fetchProjects = () => {
        axios.get('http://localhost:8000/projects/', {
            headers: {
                Authorization: `Token ${user.token}` 
            }
        })
        .then(response => {
            console.log("Projects fetched:", response.data); 
            setProjects(response.data);
            setFilteredProjects(response.data);
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
        });
    };





    // functionality for searching a project

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = (event) => {
        if (event) event.preventDefault();
        const term = searchTerm.toLowerCase();

        if (term.trim() === "") {
            setFilteredProjects(projects);
        } else {
            const filteredItems = projects.filter((project) =>
                project.title.toLowerCase().includes(term)
            );

            if (filteredItems.length === 0) {
                alert("No match found");
                setSearchTerm("");
            } else {
                setFilteredProjects(filteredItems);
            }
        }
    };




     // function to correct the time format


     function correctDateTime(dateString) {
        const date = new Date(dateString);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        

        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; 
        
        return `${day}-${month}-${year} (${String(hours).padStart(2, '0')} : ${minutes} : ${seconds} ${amPm})`;
    }


    

    
    if (!user || !user.token) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="notebook-container">
            <Navbar />
            <div className="notebook-content mt-3">
                <div style={{display: 'flex', justifyContent:'space-between'}}>
                    <h2>Projects</h2>
                    <span style={{cursor:'pointer'}} onClick={() => setCreateProjectModel(true)}>Create Project <i style={{fontSize:"14px"}} className="fa">&#xf040;</i></span>
                </div>
                <div className="search-bar d-flex">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by project title"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                    <button className="btn btn-warning" onClick={handleSearch}>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
                <div className="projects-list">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map(project => (
                            <div className='project-card' key={project.id}>
                                <h3 style={{textTransform:'capitalize'}}><b>{project.title}</b></h3>
                                <p><b>Created on :</b> {correctDateTime(project.created_date)} </p>
                                <Link to={`/projects/${project.id}`} className="btn btn-primary btn-sm">
                                    View Tdodo's
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No projects available.</p>
                    )}
                </div>
            </div>

            {createProjectModel && (
            <div className="modal show" style={{ display: 'block', zIndex: '1050', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Project</h5>
                        <button type="button" className="close" onClick={() => setCreateProjectModel(false)}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            className='form-control m-2'
                            placeholder="Type project name"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setCreateProjectModel(false)}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleCreateProject}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    )}


        </div>
    );
}

export default Home;
