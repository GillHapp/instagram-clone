import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloundinary.js";

dotenv.config();

export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(401).json({
                message: "Credentials are required",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, password, email });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        await newUser.save();  // Corrected this line

        return res.status(201).json({
            message: "User registered successfully",
            success: true
        });
    } catch (error) {
        console.log('There is something wrong at user registration time:', error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                message: "Credentials are required",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Don't reassign user. Instead, return specific fields to the client.
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePitcure: user.profilePitcure,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
            bookmark: user.bookmark,
        };
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return res.cookie(
            "token", token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }
        ).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user: userData  // Return only the user data needed
        });

    } catch (error) {
        console.log('There is something wrong at user login time:', error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

export const logOut = async (_, res) => {
    return res.clearCookie("token").json({ message: "User logged out successfully", success: true });
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({
            message: "User profile fetched successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.log('There is something wrong at user profile fetching time:', error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePitcure = req.file;
        let cloundResponse;
        if (profilePitcure) {
            const fileUri = getDataUri(profilePitcure);
            cloundResponse = await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById(userId);

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (cloundResponse) user.profilePitcure = cloundResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "User profile updated successfully",
            success: true,
            user,
        });

    } catch (error) {
        console.log('There is something wrong at user profile updating time:', error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const getSuggestedUsers = async (req, res) => {

    try {
        const users = await User.find({ _id: { $ne: req.id } }).select(-password);
        if (!users) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({ message: "Suggested users fetched successfully", success: true, users });
    } catch (error) {
        console.log("ther is something wrong while fecting the all suggested users", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

export const followAndUnfollow = async (req, res) => {
    const follower = await req.id;
    const following = await req.params.id;
    if (follower === following) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findOne(follower);
    const targetUser = await User.findOne(following);
    if (!user || !targetUser) {
        return res.status(404).json({ message: "User not found" });
    }
    const isFollowing = user.following.includes(following);
    if (isFollowing) {

    } else {

    }
}