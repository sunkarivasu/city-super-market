const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        .then(() => console.log(`⚡[server][${process.env.MONGO_ENV}-${process.env.NODE_ENV}] Database connection established`))
        .catch(err => {
            console.error(`⚡[server][${process.env.MONGO_ENV}-env] Database connection error: ${err.message}`);
            process.exit(1);
        });
}
else {
    mongoose.connect(process.env.MONGO_DEV_URI, { useNewUrlParser: true })
        .then(() => console.log(`⚡[server][${process.env.MONGO_ENV}-${process.env.NODE_ENV}] Database connection established`))
        .catch(err => {
            console.error(`⚡[server][${process.env.MONGO_ENV}-${process.env.NODE_ENV}] Database connection error: ${err.message}`);
            process.exit(1);
        })
}
