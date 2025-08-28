# 🎬 Movie Booking System

A full-stack movie ticket booking platform built with **Next.js** (frontend) and **Express + MongoDB** (backend).  
Users can browse movies, check cinema showtimes, select seats, and complete bookings with confirmation.

---

## 🚀 Features

- **Browse Movies** – See all available movies on the home page.
- **Movie Details Page** – View details of a movie and available cinemas showing it.
- **Location Detection** – Detects user’s city automatically to show relevant cinemas.
- **Cinema & Showtimes** – Explore cinemas by location, view screens, and available shows.
- **Seat Selection** – Choose available seats for a selected show.
- **Checkout Page** – Review booking details before payment.
- **Booking Confirmation** – After successful booking, users are redirected to a "Thank You" page showing their booking details.
- **Admin Panel** – Admin can add cinemas, screens, movies, and shows (secured by JWT auth).

---

## 🏗️ Project Structure

/backend
├── models/ # Mongoose models (Movie, Cinema, Screen, Show, Booking)
├── routes/ # Express routes for movies, cinemas, shows, bookings
├── controllers/ # Controllers for handling API logic
└── server.js # Express server setup

/frontend (Next.js)
├── app/
│ ├── page.tsx # Home page (movie listing)
│ ├── movie/[id]/page.tsx # Movie details + "Book Tickets"
│ ├── book/[id]/page.tsx # Cinema + seat selection
│ ├── checkout/[id]/page.tsx # Checkout & payment
│ └── thank-you/[id]/page.tsx # Booking confirmation
└── components/ # Reusable UI components


---

## ⚙️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Axios  
- **Backend**: Node.js, Express.js, MongoDB, Mongoose  
- **Auth**: JWT (Admin operations)  
- **Deployment**: Can be deployed on Vercel (frontend) & VPS/Heroku/DigitalOcean (backend)

---

## 📌 API Endpoints

### 🎥 Movies
- `GET /movies` → Get all movies  
- `GET /movies/:id` → Get details of a specific movie  

### 🍿 Cinemas
- `GET /cinema/list?city=` → List cinemas by city  
- `GET /cinema/:id/details` → Get cinema details with movies/shows  

### 🕒 Shows
- `GET /show/details/:id` → Get show details (with movie, screen, timings)  
- `POST /show/add` → Add new show (**Admin only**)  

### 🎟️ Booking
- `POST /booking/:showId/book` → Book selected seats  
- Response Example:
```json
{
  "bookingId": "68af6ff1fa34ea0012f4a892",
  "seats": ["A7", "A3", "B7"],
  "totalPrice": 750,
  "reference": "BK-MEUGAPH3-YVNQ0C"
}
```
💻 Setup Instructions

1️⃣ Clone the Repository
```
git clone https://github.com/your-username/movie-booking-system.git
cd movie-booking-system
```
2️⃣ Backend Setup
```
cd backend
npm install
```
Create a .env file:
```
MONGO_URI=mongodb://localhost:27017/movie_booking
JWT_SECRET=your_secret_key
PORT=5000
```

Start backend:
```
npm run dev
```
3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```
4️⃣ Visit App

`Frontend`: http://localhost:3000
`Backend`: http://localhost:5000

✅ Booking Flow

User lands on Home Page → selects a movie.
On Movie Page, clicks Book Tickets → chooses cinema & showtime.
On Seat Selection Page, selects seats → proceeds to checkout.
On Checkout Page, confirms booking → seats + amount sent to backend.
Backend responds with booking confirmation → redirected to Thank You Page.

👨‍💻 Admin Features

Admins can:
Add/Edit Movies
Add Cinemas & Screens
Add Shows (linked with movie & screen)
View bookings
Admin APIs are secured via JWT.

🛠️ Future Enhancements

Payment Gateway Integration (Razorpay/Stripe)
User Accounts & Booking History
Movie Reviews & Ratings
Notifications & Email confirmations

👥 Contributors

Parth Gera – Full-stack Development
