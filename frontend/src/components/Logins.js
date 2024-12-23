import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./login.css";

const Logins = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:6005/login', { email, password }, { withCredentials: true });
            console.log('Login Response:', response);
            if (response.status === 200) {
                alert('Login successful!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Invalid credentials. Please try again.');
        }
    };

    const loginwithgoogle = () => {
        window.open("http://localhost:6005/auth/google/callback", "_self");
    };

    return (
        <div className="login-page">
            <h1 style={{ textAlign: 'center' }}>Login</h1>
            <div className="form">
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <button type="submit">Login</button>
                    <p className="message">Not Registered? <a href="/signup">Create an account</a></p>
                </form>
                <button className="login-with-google-btn" onClick={loginwithgoogle}>
                    Sign In With Google
                </button>
            </div>
        </div>
    );
}

export default Logins;
