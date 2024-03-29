const User = require('../models/user');
module.exports = async (req, res, next) => {
    if (!req.session.isAuthenticated) return next();
    req.user = await User.findById(req.session.user._id);
    next();
};