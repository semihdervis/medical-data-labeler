const User = require('../models/UserModel');

const checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId); // Assuming req.userId is set after authentication
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = checkAdmin;