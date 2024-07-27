
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Signin.css';

function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const { username, email, password } = formData;
    const navigate = useNavigate();
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/register', formData);
            console.log(res.data);
            console.log("submission successful");
            navigate('/signin');
        } catch (err) {
            console.error(err.response.data);
            console.log("dikkat ho gyi bhai");
        }
    }

    return (
        <div className="signin-container">
            <h1>Sign Up here</h1>
            <div className="form-container">
                <form onSubmit={onSubmit} className="signin-form">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                    <button type="submit" className="signin-button">Sign Up</button>
                </form>
                <div className="or-separator">or</div>
                <button className="signup-button" onClick={() => navigate('/signin')}>Sign In</button>
            </div>
        </div>
    )
}

export default Signup;
