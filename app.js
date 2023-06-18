const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const passport = require("passport");


// Middlewares
app.use(cors());
app.use(express.json())
app.use(passport.initialize());

// Configuration
dotenv.config();
require('./config/db');
require("./config/passport")(passport);


// Constants
PORT = process.env.PORT || 9000;


// Routes
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/normalOffers", require("./routes/normalOffers"));
app.use("/api/offerUsers", require("./routes/offerUsers"));
app.use("/api/userRequests", require("./routes/userRequests"));

// Cron Jobs
require('./jobs/generateWinner');

// Serve Client
// if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.resolve('client', 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
});
// }

// Server
app.listen(PORT, console.log(`⚡[server] Server is running @${PORT}`));