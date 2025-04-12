const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  deleteBooking,
} = require("../controllers/dashboard/bookings/bookingController");
const { protect } = require("../middleware/(auth)/auth");

// Create a new booking
router.post("/", protect, createBooking);

// Get bookings
router.get("/", protect, getBookings);

// Delete a booking
router.delete("/:id", protect, deleteBooking);

module.exports = router;
