const {
    generateRandomPassword,
    generateJwtToken,
    decodeJwtToken,
    generateOtp,
    generateOtpHash,
    verifyOtpHash
} = require('../utils/auth');
const sendEmail = require('../utils/sendEmail');
const { Admin } = require('../models');

const registerAdmin = ({ name, email, password, allow_password_change }) => new Promise(async (resolve, reject) => {
    try {
        // Check if admin already exists
        const admin = await Admin.findOne({ email });
        if (admin) return reject({ status: 409, msg: 'Admin already exists', err: { email: 'User already exists' } });

        // Generate password if not provided
        password = password || generateRandomPassword();

        // Update database
        let newAdmin = new Admin({ name, email, password, allow_password_change });
        newAdmin = await newAdmin.save();

        // Send email
        await sendEmail({
            to: email,
            subject: 'Admin Registration',
            html: `
                <h1>Admin Registration</h1>
                <p>Hi ${name},</p>
                <p>You have been registered as an admin on City Super Market.</p>
                <p>Your login credentials are:</p>
                <p>Email: ${email}</p>
                <p>Password: ${password}</p>
                <p>Please login to your account and change your password.</p>
                <p>Thank you.</p>
            `
        });

        return resolve({
            id: newAdmin._id,
            name: newAdmin.name,
            email: newAdmin.email
        });
    } catch (err) {
        console.error(`⚡[server][AdminControllers][registerAdmin][${email}] Error while registering admin:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const loginAdmin = ({ email, password }) => new Promise(async (resolve, reject) => {
    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) return reject({ status: 422, msg: 'Invalid Credentials', err: { email: 'Invalid username or password', password: 'Invalid username or password' } });

        // Validate password
        if (!admin.authenticate(password)) return reject({ status: 404, msg: 'Invalid Credentials', err: { email: 'Invalid username or password', password: 'Invalid username or password' } });

        // Generate and return JWT token
        const adminPayload = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            allow_password_change: admin.allow_password_change,
            role: admin.role
        };

        const jwtToken = generateJwtToken(adminPayload);

        return resolve(jwtToken);
    } catch (err) {
        console.error(`⚡[server][AdminControllers][loginAdmin][${email}] Error while logging in admin:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const updateAdminPassword = ({ password, token }) => new Promise(async (resolve, reject) => {
    try {
        const decoded = decodeJwtToken(token.split(' ')[1]);
        if (!decoded) return reject({ status: 401, msg: 'Invalid token' });

        const admin = await Admin.findById(decoded.id);

        // Check if admin exists
        if (!admin) return reject({ status: 404, msg: 'Admin not found' });

        // Check if password change is allowed
        if (!admin.allow_password_change) return reject({ status: 403, msg: 'Password change not allowed' });

        // Update password
        admin.password = password;
        admin.allow_password_change = false;

        // Save admin
        await admin.save();

        const adminPayload = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };

        return resolve(generateJwtToken(adminPayload));
    } catch (err) {
        console.error(`⚡[server][AdminControllers][updateAdminPassword] Error while updating admin password:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const forgotPassword = ({ email }) => new Promise(async (resolve, reject) => {
    try {
        console.log(email);
        const admin = await Admin.findOne({ email, allow_password_change: false });

        // Check if admin exists
        if (!admin) return reject({ status: 404, msg: 'Admin not found, Please register to continue' });

        // Send OTP
        const otp = generateOtp();
        const otpHash = generateOtpHash(otp, email);
        await sendEmail({
            to: email,
            subject: 'OTP for password reset',
            html: `
                <h1>OTP for password reset</h1>
                <p>Hi ${admin.name},</p>
                <p>Your OTP for password reset is:</p>
                <p>${otp}</p>
                <p>Thank you.</p>
            `
        });

        return resolve(otpHash);
    } catch (err) {
        console.error(`⚡[server][AdminControllers][forgotPassword][${email}] Error while sending OTP to reset password:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

const resetAdminPassword = ({ email, otp, otpHash, password }) => new Promise(async (resolve, reject) => {
    try {
        const admin = await Admin.findOne({ email, allow_password_change: false });

        // Check if admin exists
        if (!admin) return reject({ status: 404, msg: 'Admin not found, Please register to continue' });

        // verify OTP
        verifyOtpHash(otp, email, otpHash, async (err) => {
            if (err) return reject({ status: 401, msg: 'Invalid OTP' });

            // Update password
            admin.password = password;
            await admin.save();

            const adminPayload = {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            };

            return resolve(generateJwtToken(adminPayload));
        });
    } catch (err) {
        console.error(`⚡[server][AdminControllers][resetAdminPassword] Error while resetting admin password:`, err);
        reject({ status: 500, msg: 'Internal Server Error' });
    }
});

module.exports = {
    registerAdmin,
    loginAdmin,
    updateAdminPassword,
    forgotPassword,
    resetAdminPassword
};