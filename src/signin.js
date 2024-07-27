import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Signin.css';

function Signin() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const navigate = useNavigate();
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/login', formData);
            localStorage.setItem('token', res.data.token);
            console.log(res.data);
            console.log("login successful");
            navigate('/');
        } catch (err) {
            console.error(err.response.data);
            console.log("dikkat ho gyi bhai");
        }
    }

    return (
        <div className="signin-container">
            <h1>Sign In</h1>
            <div className="form-container">
                <form onSubmit={onSubmit} className="signin-form">
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

                    <button type="submit" className="signin-button">Sign In</button>
                </form>
                <div className="or-separator">or</div>
                <button className="signup-button" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
        </div>
    )
}

export default Signin;
