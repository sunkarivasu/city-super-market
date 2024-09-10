const isAdmin = (req, res, next) => {
    console.log("validating isAdmin or not")
    console.log(req.user);
    if (!req.user) {
        return res.status(403).json({ msg: 'Forbidden' });
    }

    next();
};

module.exports = {
    isAdmin
}