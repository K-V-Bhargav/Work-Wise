import React, { useState } from "react";
import "./RegisterLogin.css";
import { useNavigate } from "react-router-dom";

const RegisterLogin = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(true);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateOtp = async () => {
    const url = "http://localhost:8000/otp/generate";
    const body = {
      username: formData.email,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      await response.json();
      setIsOtpSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  const verifyOtp = async () => {
    const url = "http://localhost:8000/otp/validate";
    const body = {
      username: formData.email,
      otp: formData.otp,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      const result = await response.json();
      setUserId(result.userId);
      setIsOtpVerified(true);
      setIsOtpSent(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegistering
      ? "http://localhost:8000/register"
      : "http://localhost:8000/login";
    const body = isRegistering
      ? {
          username: formData.email,
          password: formData.password,
          phone: formData.phone,
        }
      : {
          username: formData.email,
          password: formData.password,
        };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      await response.json();
      if (userId) {
        navigate("/file", { state: { userId: userId } });
      } else {
        console.error("User ID not found");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h1>{isRegistering ? "Register" : "Login"}</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {!isRegistering && !isOtpSent && !isOtpVerified && (
            <button
              type="button"
              onClick={generateOtp}
              className="generate-otp-btn"
            >
              Generate OTP
            </button>
          )}
          {!isRegistering && isOtpVerified && (
            <h2
              style={{
                color: "green",
                fontWeight: "bold",
                padding: "10px",
                backgroundColor: "#e0ffe0",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              OTP Verified !!
            </h2>
          )}
        </div>
        {!isRegistering && isOtpSent && (
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="verify-otp-btn"
            >
              Verify OTP
            </button>
          </div>
        )}
        <button
          type="submit"
          className="submit-btn"
          disabled={isRegistering ? false : !isOtpVerified}
        >
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="toggle-btn"
      >
        Switch to {isRegistering ? "Login" : "Register"}
      </button>
    </div>
  );
};

export default RegisterLogin;
