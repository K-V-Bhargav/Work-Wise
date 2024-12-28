# 🚆 Train Seat Reservation System  

A comprehensive application for train seat reservation with real-time seat allocation, user authentication, and conflict-free booking. Built with **React.js**, **Node.js**, **Express.js**, and **MongoDB**.

---

## 📋 Table of Contents  

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Setup Instructions](#setup-instructions)  
- [API Documentation](#api-documentation)  
- [Future Enhancements](#future-enhancements)  

---

## ✨ Features  

- **Priority-Based Seat Booking**: Ensures seats are booked in one row if possible.  
- **Proximity Allocation**: Nearby seats are allocated when a full row isn't available.  
- **User Authentication**: Login and signup functionality with secure password handling.  
- **Dynamic Seat Availability**: Real-time updates of reserved and available seats.  
- **Cancellation & Reset**: Users can cancel bookings, and admins can reset the coach.  

---

## 💻 Technologies Used  

### Frontend  
- **React.js**  
- **Bootstrap** for responsive design.  
- **Axios** for API calls.  

### Backend  
- **Node.js**  
- **Express.js**  
- **MongoDB** (via **Mongoose**).  

## 🛠️ Setup Instructions  

### Prerequisites  
Ensure the following are installed on your system:  
- **Node.js**  
- **MongoDB** (local or **MongoDB Atlas** for cloud)  

### Clone the Repository  
```bash  
git clone https://github.com/your-username/train-seat-reservation.git  
cd train-seat-reservation  
```  

### Backend Setup  
1. Navigate to the backend folder:  
   ```bash  
   cd backend  
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Create a `.env` file:  
   ```plaintext  
   PORT=8000  
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/reservation  
   JWT_SECRET=your_secret_key  
   ```  
4. Start the backend server:  
   ```bash  
   npm start  
   ```  

### Frontend Setup  
1. Navigate to the frontend folder:  
   ```bash  
   cd ../frontend  
   ```  
2. Install dependencies:  
   ```bash  
   npm install  
   ```  
3. Start the development server:  
   ```bash  
   npm start  
   ```  

### Access the Application  
- Frontend: `http://localhost:3000`  
- Backend: `http://localhost:8000/api

---

## 📚 API Documentation  

### Base URL  
`http://localhost:8000/`

Here is the list of APIs provided in the code, with their descriptions:

---

### **Authentication and User Management**
1. **Register User**
   - **Endpoint**: `/register`
   - **Method**: `POST`
   - **Description**: Registers a new user with `username`, `password`, and `phoneNumber`.
   - **Body**: 
     ```json
     {
       "username": "user@example.com",
       "password": "password123",
       "phoneNumber": "1234567890"
     }
     ```
   - **Response**: 
     - `200 OK`: User registered successfully.
     - `400 Bad Request`: User already exists.
     - `500 Internal Server Error`: Error details.

2. **Login**
   - **Endpoint**: `/login`
   - **Method**: `POST`
   - **Description**: Authenticates a user with `username` and `password`.
   - **Body**: 
     ```json
     {
       "username": "user@example.com",
       "password": "password123"
     }
     ```
   - **Response**: 
     - `200 OK`: Login successful.
     - `400 Bad Request`: Invalid password.
     - `404 Not Found`: User not found.

---

### **OTP Management**
3. **Generate OTP**
   - **Endpoint**: `/otp/generate`
   - **Method**: `POST`
   - **Description**: Generates a one-time password (OTP) and sends it to the user's email.
   - **Body**: 
     ```json
     {
       "username": "user@example.com"
     }
     ```
   - **Response**: 
     - `200 OK`: OTP sent successfully.
     - `400 Bad Request`: Email is required.
     - `404 Not Found`: User not found.
     - `500 Internal Server Error`: Failed to send OTP email.

4. **Validate OTP**
   - **Endpoint**: `/otp/validate`
   - **Method**: `POST`
   - **Description**: Validates the OTP for the given user.
   - **Body**: 
     ```json
     {
       "username": "user@example.com",
       "otp": "123456"
     }
     ```
   - **Response**: 
     - `200 OK`: OTP validated successfully.
     - `400 Bad Request`: Username or OTP missing, invalid, or expired.
     - `404 Not Found`: User or OTP not found.

---

### **User Details**
5. **Retrieve User by ID**
   - **Endpoint**: `/user/:id`
   - **Method**: `GET`
   - **Description**: Retrieves user details by user ID.
   - **Response**: 
     - `200 OK`: User details.
     - `404 Not Found`: User not found.
     - `500 Internal Server Error`: Error retrieving user.

---

### **Seat Reservation System**
6. **Get Available Seats**
   - **Endpoint**: `/available-seats`
   - **Method**: `GET`
   - **Description**: Fetches a list of available seat numbers.
   - **Response**: 
     - `200 OK`: List of available seats.
     - `500 Internal Server Error`: Error fetching available seats.

7. **Reserve Seats**
   - **Endpoint**: `/reserve-seats`
   - **Method**: `POST`
   - **Description**: Reserves one or more seats for a user.
   - **Body**: 
     ```json
     {
       "username": "user@example.com",
       "seatNumbers": [1, 2, 3]
     }
     ```
   - **Response**: 
     - `200 OK`: Seats reserved successfully.
     - `400 Bad Request`: Seats are already reserved or out of range.
     - `404 Not Found`: User not found.
     - `500 Internal Server Error`: Error reserving seats.

---

### **Setup Instructions**
1. **Dependencies**:
   Ensure the following are installed:
   - Node.js
   - MongoDB

2. **Setup**:
   - Clone the repository.
   - Run `npm install` to install dependencies.
   - Set up your MongoDB instance (default: `mongodb://127.0.0.1:27017/test`).
   - Configure the email service (replace credentials in `nodemailer` configuration).

3. **Run Server**:
   - Start the server with `node <filename>.js`.
   - Server runs on port `8000`.

---

Would you like help with further customization or a README file?

---

## 🔮 Future Enhancements  

- **Payment Gateway Integration**.  
- **Admin Dashboard** to monitor seat availability and manage resets.  
- **Multi-Coach Support** for large-scale applications.  
- **Notifications** for booking confirmation or updates.  

---

---  

### 🌟 Star this repository if you find it helpful!  
Feel free to contribute by creating issues or submitting pull requests.  

---  
