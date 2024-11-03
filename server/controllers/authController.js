const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');

exports.register = async (req, res) => {
    const { name, username, email, password, isAdmin } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already in use' });
        }

        const user = new User({ name, username, email, password, isAdmin });
        await user.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login request received'); // Debugging line
        console.log('Email:', email); // Debugging line
        const user = await User.findOne({ email });
        console.log('User found:', user); // Debugging line
        if (!user) {
            console.log('User not found'); // Debugging line
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        console.log('Password provided:', password); // Debugging line
        console.log('Password stored:', user.password); // Debugging line
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match'); // Debugging line
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error); // Debugging line
        res.status(500).json({ message: error.message });
    }
};