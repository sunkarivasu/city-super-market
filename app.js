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
app.use("/users", require("./routes/users"));
app.use("/categories", require("./routes/categories"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/orders"));
app.use("/payments", require("./routes/payments"));
app.use("/offers", require("./routes/offers"));
app.use("/normalOffers", require("./routes/normalOffers"));
app.use("/offerUsers", require("./routes/offerUsers"));
app.use("/userRequests", require("./routes/userRequests"));

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