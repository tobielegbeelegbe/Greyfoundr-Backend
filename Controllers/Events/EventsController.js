const express = require('express');
const router = express.Router();
const Paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY); // Assuming Paystack SDK is installed
const io = require('socket.io')(server); // Assuming Socket.IO is set up for real-time effects

// Mock user authentication (replace with actual auth middleware)
const authenticateGuest = (req, res, next) => {
  // Simple check for guest login (e.g., via session or token)
  if (!req.session.guestId) {
    return res.status(401).json({ error: 'Guest not logged in' });
  }
  next();
};

// Mock event data (replace with database model)
const events = [
  { id: 1, name: 'Charity Event', donations: [] },
  // Add more events as needed
];

// Mock wallet system (replace with actual wallet integration, e.g., Web3 for crypto)
const guestWallets = {}; // In-memory store for simplicity

// Route to view event page (requires guest login)
router.get('/events/:id', authenticateGuest, (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json({ event, guestId: req.session.guestId });
});

// Route to initiate donation via Paystack
router.post('/events/:id/donate/paystack', authenticateGuest, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const { amount, email } = req.body; // Amount in kobo (Paystack uses kobo for NGN)
  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  try {
    // Initialize Paystack transaction
    const response = await Paystack.transaction.initialize({
      amount,
      email,
      callback_url: `${process.env.BASE_URL}/events/${eventId}/donate/paystack/callback`,
    });

    // Store transaction reference in session or database for verification
    req.session.paystackRef = response.data.reference;

    res.json({ authorization_url: response.data.authorization_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Paystack callback route (handles successful payment)
router.get('/events/:id/donate/paystack/callback', authenticateGuest, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const { reference } = req.query;
  const event = events.find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  try {
    // Verify transaction
    const verification = await Paystack.transaction.verify(reference);
    if (verification.data.status === 'success') {
      const amount = verification.data.amount / 100; // Convert from kobo to NGN
      event.donations.push({ guestId: req.session.guestId, amount, method: 'paystack' });

      // Emit real-time event for confetti and sound (via Socket.IO)
      io.to(`event-${eventId}`).emit('donation', { guestId: req.session.guestId, amount });

      res.redirect(`/events/${eventId}?success=true`);
    } else {
      res.redirect(`/events/${eventId}?error=payment_failed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Route to donate via wallet (mock implementation)
router.post('/events/:id/donate/wallet', authenticateGuest, (req, res) => {
  const eventId = parseInt(req.params.id);
  const { amount } = req.body;
  const event = events.find(e => e.id === eventId);
  const guestId = req.session.guestId;

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Check wallet balance
  if (!guestWallets[guestId] || guestWallets[guestId] < amount) {
    return res.status(400).json({ error: 'Insufficient wallet balance' });
  }

  // Deduct from wallet and add to event donations
  guestWallets[guestId] -= amount;
  event.donations.push({ guestId, amount, method: 'wallet' });

  // Emit real-time event for confetti and sound
  io.to(`event-${eventId}`).emit('donation', { guestId, amount });

  res.json({ success: true, newBalance: guestWallets[guestId] });
});

// Route to add funds to wallet (for demo purposes)
router.post('/wallet/add', authenticateGuest, (req, res) => {
  const { amount } = req.body;
  const guestId = req.session.guestId;
  guestWallets[guestId] = (guestWallets[guestId] || 0) + amount;
  res.json({ newBalance: guestWallets[guestId] });
});

// Socket.IO connection for real-time effects
io.on('connection', (socket) => {
  socket.on('join-event', (eventId) => {
    socket.join(`event-${eventId}`);
  });
});

module.exports = router;
