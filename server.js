// server.js
const express = require('express');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
console.log("server loaded");
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert('serviceAccountKey.json'),
  databaseURL: 'https://tree-tales-79a64-default-rtdb.firebaseio.com'
});

// Reference to your database
const db = admin.database().ref('bookings');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'treetales4@gmail.com',
    pass: 'ihso xphz afzf nggf'
  }
});

// Create an Express app
const app = express();

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// API endpoint to send email
app.post('/send-email', (req, res) => {
  try {
    // Fetch data from Firebase
    db.once('value', (snapshot) => {
      const data = snapshot.val();
      const formattedData = JSON.stringify(data, null, 2);

      const mailOptions = {
        from: 'treetales4@gmail.com',
        to: 'dineshbro010@gmail.com',
        subject: 'Trees Booking Data',
        text: formattedData
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send({ message: 'Error sending email' });
        }
        res.send({ message: 'Email sent successfully' });
      });
    });
  } catch (error) {
    res.status(500).send({ message: 'Error sending email' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});