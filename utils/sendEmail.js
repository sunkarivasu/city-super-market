const nodemailer = require('nodemailer');

const mailOptions = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};

const transporter = nodemailer.createTransport(mailOptions);

const sendEmail = (mailParams) => new Promise((resolve, reject) => {
    transporter.sendMail(
        {
            from: process.env.EMAIL_USER,
            text: mailParams.html,
            ...mailParams,
        }, (err, info) => {
            if (err) {
                console.error(`⚡[server][utils][sendEmail] Error Sending E-Mail:`, err);
                return reject({ msg: 'Internal server error', err: {}, status: 500 });
            }

            console.log(`⚡[server][utils][sendEmail] E-Mail sent:`, info);
            return resolve(true);
        }
    );
});

module.exports = sendEmail;