import User from '../models/user.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token with Safety Fallback
const generateToken = (id) => {
    // 1. Try to get secret from .env
    // 2. If missing, use a temporary fallback string to prevent crashes
    const secret = process.env.JWT_SECRET || "fallback_secret_key_for_dev";
    
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Create the user
        const user = await User.create({
            fullName,
            email,
            password // This will be hashed by the pre-save hook in user.js
        });

        // 3. Respond with User Data + Token
        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });

        // 2. Check password
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: error.message });
    }
};