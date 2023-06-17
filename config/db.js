const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log(`⚡[server][${process.env.MONGO_ENV}-env] Database connection established`))
    .catch(err => {
        console.error(`⚡[server][${process.env.MONGO_ENV}-env] Database connection error: ${err.message}`);
        process.exit(1);
    });