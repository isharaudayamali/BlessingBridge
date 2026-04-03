const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
const registerUser = async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.role) {
        return res.status(400).json({ message: 'Username, password and role are required' });
    }
    const { username, password, role } = req.body;

    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, password, role });
        res.status(201).json({ id: user._id, username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    const userId = req.userId || req.params.id;
    const { username, password, role } = req.body;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (role) user.role = role;


        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            role: updatedUser.role,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

//login user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET || 'dev_secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        return res.json({
            success: true,
            token,
            user: {
                id: existingUser._id,
                username: existingUser.username,
                role: existingUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//get user profile
const getProfile = async (req, res) => {
    try {        const userId = req.userId || req.body.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userData = await User.findById(userId).select('-password');
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, userData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }   
};
        

module.exports = { registerUser, updateUserProfile, loginUser, getProfile };
