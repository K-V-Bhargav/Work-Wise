import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./File.css";

const TOTAL_SEATS = 80;
const SEATS_PER_ROW = 7;

const generateSeats = () => {
  const seats = [];
  for (let i = 1; i <= TOTAL_SEATS; i++) {
    seats.push({
      id: i,
      isBooked: false,
      isDisabled: false,
    });
  }
  return seats;
};

const File = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const [userDetails, setUserDetails] = useState(null);
  const [seats, setSeats] = useState(generateSeats());
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bookingInput, setBookingInput] = useState("");
  const [error, setError] = useState("");
  const [availableSeats, setAvailableSeats] = useState([]);

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const response = await fetch("http://localhost:8000/available-seats");
        if (!response.ok) {
          throw new Error("Failed to fetch available seats");
        }
        const data = await response.json();
        setAvailableSeats(data.availableSeats);

        const updatedSeats = seats.map((seat) => ({
          ...seat,
          isDisabled: !data.availableSeats.includes(seat.id),
        }));
        setSeats(updatedSeats);
      } catch (err) {
        setError("Failed to fetch available seats. Please try again later.");
        console.error(err);
      }
    };

    fetchAvailableSeats();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`http://localhost:8000/user/${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user details");
          }
          const data = await response.json();
          setUserDetails(data);
        } catch (err) {
          setError("Failed to fetch user details. Please try again later.");
          console.error(err);
        }
      };
      fetchUserDetails();
    }
  }, [userId]);

  const handleBooking = () => {
    const numSeats = parseInt(bookingInput);
    if (isNaN(numSeats) || numSeats < 1 || numSeats > SEATS_PER_ROW) {
      setError("Please enter a number between 1 and 7.");
      return;
    }

    const availableSeatsFiltered = seats.filter(
      (seat) => !seat.isBooked && !seat.isDisabled
    );
    if (availableSeatsFiltered.length < numSeats) {
      setError("Not enough seats available.");
      return;
    }

    setError("");

    const rows = Math.ceil(TOTAL_SEATS / SEATS_PER_ROW);
    let selectedSeats = [];
    for (let row = 0; row < rows; row++) {
      const rowStart = row * SEATS_PER_ROW;
      const rowSeats = availableSeatsFiltered.filter(
        (seat) => seat.id > rowStart && seat.id <= rowStart + SEATS_PER_ROW
      );

      if (rowSeats.length >= numSeats) {
        selectedSeats = rowSeats.slice(0, numSeats);
        break;
      }
    }

    if (selectedSeats.length === 0) {
      selectedSeats = availableSeatsFiltered.slice(0, numSeats);
    }

    const updatedSeats = seats.map((seat) =>
      selectedSeats.some((s) => s.id === seat.id)
        ? { ...seat, isBooked: true }
        : seat
    );
    setSeats(updatedSeats);
    setBookedSeats((prev) => [...prev, ...selectedSeats]);
    setBookingInput("");
  };

  const handleReset = () => {
    setSeats(generateSeats());
    setBookedSeats([]);
    setBookingInput("");
    setError("");
  };

  const handleSubmit = () => {
    const formData = {
      username: userDetails?.user?.username || "Unknown User",
      seatNumbers: bookedSeats.map((seat) => seat.id),
    };
    fetch("http://localhost:8000/reserve-seats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Booking successfully submitted!");
        } else {
          throw new Error("Failed to submit booking.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while submitting the booking.");
      });
  };

  const unavailableSeats = seats.filter(
    (seat) => seat.isBooked || seat.isDisabled
  );
  const availableSeatsCount = TOTAL_SEATS - unavailableSeats.length;

  return (
    <div className="file-container">
      <h1 className="title">Hello, World!</h1>
      <p className="user-id">User ID: {userId || "Not Available"}</p>
      {userDetails ? (
        <div className="user-details">
          <h2>User Details</h2>
          <p>User Name: {userDetails.user.username}</p>
          <p>Password: {userDetails.user.password}</p>
          <p>Phone: {userDetails.user.phoneNumber}</p>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
      <div className="app">
        <h1>Ticket Booking</h1>
        <div className="container">
          <div className="seats">
            {seats.map((seat) => (
              <button
                key={seat.id}
                className={`seat 
                  ${seat.isBooked ? "booked" : ""} 
                  ${seat.isDisabled ? "disabled" : ""}`}
                disabled={seat.isDisabled || seat.isBooked}
              >
                {seat.id}
              </button>
            ))}
          </div>
          <div className="controls">
            <h6>Book Seats</h6>
            <div className="booking-container">
              <input
                type="number"
                placeholder="Enter number of seats"
                value={bookingInput}
                onChange={(e) => setBookingInput(e.target.value)}
                className="booking-input"
              />
              <button onClick={handleBooking} className="booking-button">
                Book
              </button>
            </div>
            <button onClick={handleReset} className="reset-button">
              Reset Booking
            </button>
            {error && <p className="error">{error}</p>}
            <button onClick={handleSubmit} className="submit-button">
              Confirm Booking
            </button>
          </div>
        </div>
        <div className="footer">
          <p>Booked Seats: {bookedSeats.length}</p>
          <p>Unavailable Seats: {unavailableSeats.length}</p>
          <p>Available Seats: {availableSeatsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default File;
