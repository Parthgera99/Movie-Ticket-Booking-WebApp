import express from 'express';
import { bookTickets, getUserBookings, getBookingDetails, cancelBooking } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const bookingRouter = express.Router();

// booking on a show
bookingRouter.post('/:id/book', verifyToken, bookTickets);

// user's bookings
bookingRouter.get('/my', verifyToken, getUserBookings);
bookingRouter.get('/:id', verifyToken, getBookingDetails);
bookingRouter.put('/:id/cancel', verifyToken, cancelBooking);

export default bookingRouter;
