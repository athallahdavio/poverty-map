import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(API_URL + "/api/auth/login", {
        username,
        password,
      });

      // Save token to localStorage (or handle the token accordingly)
      localStorage.setItem("token", response.data.token);

      // Redirect to another page after successful login
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col p-8 m-auto shadow-md rounded border-2">
        <div className="text-blue-700 text-3xl font-medium mb-8 m-auto">Login Admin</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="border border-gray-300 rounded-md p-1.5 mt-1 w-80"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border border-gray-300 rounded-md p-1.5 mt-1 w-80"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md w-fit self-center mt-2">Login</button>
        </form>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;