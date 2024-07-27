import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import './Navbar.css';
import './home.css';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [document, setDocuments] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [thumbnails, setThumbnails] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const hiddenDivRef = useRef(null);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/signin');
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            const fetchDocuments = async () => {
                try {
                    const res = await axios.get('http://localhost:5001/documents', {
                        headers: { 'x-auth-token': token }
                    });
                    setDocuments(res.data);
                } catch (err) {
                    console.error(err);
                    console.log("Failed to fetch documents");
                }
            };
            fetchDocuments();
        }
    }, []);

    const createDocument = async () => {
        const res = await axios.post('http://localhost:5001/documents/', { title: 'Untitled Document' }, {
            headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setDocuments([...document, res.data]);
    }

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <img src="https://logos-world.net/wp-content/uploads/2022/05/Google-Docs-Symbol.png" alt="Site Logo" className="site-logo" />
                </div>
                <div className="navbar-center">
                    <input type="text" placeholder="Search..." className="search-bar" />
                </div>
                <div className="navbar-right">
                    <img src="" alt="Profile" className="profile-icon" onClick={toggleDropdown} />
                    {showDropdown && (
                        <div className="dropdown-menu">
                            {!isLoggedIn ? (
                                <>
                                    <div className="dropdown-item" onClick={() => navigate('/signin')}>Sign In</div>
                                    <div className="dropdown-item" onClick={() => navigate('/signup')}>Sign Up</div>
                                </>
                            ) : (
                                <div className="dropdown-item" onClick={handleLogout}>Logout</div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <div className="document-collection-container">
                <div className="document-collection">
                    <h1>Start a new Document</h1>
                    {isLoggedIn && (
                        <>
                            <div className="blank-sheet" onClick={createDocument}>
                                <img className="plus-icon" src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" alt="Blank Document" />
                            </div>
                            <h3>Blank Document</h3>
                        </>
                    )}
                </div>
            </div>

            {isLoggedIn ? (
                <>
                    <div className="my-documents-heading">
                        <h2>My documents</h2>
                    </div>
                    <div className="document-list">
                        {document.map(doc => (
                            <div className="document-item" key={doc._id}>
                                <Link to={`/documents/${doc._id}`}>
                                    <div className="document-thumbnail">
                                        <img src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" alt="Document Thumbnail" />
                                        <p>{doc.title}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="auth-options">
                    <button className="auth-button" onClick={() => navigate('/signin')}>Sign In</button>
                    <button className="auth-button" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            )}
        </>
    );
}

export default Home;
