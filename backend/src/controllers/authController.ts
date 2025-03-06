import { Request, Response } from 'express';
import userModel from '../models/User';
import { generateToken, verifyRefreshToken } from '../utils/tokenService';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google sign-in
const googleSignIn = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            res.status(400).send('Invalid Google ID token');
            return;
        }

        const { sub, email, given_name, family_name, picture } = payload;
        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                firstName: given_name,
                lastName: family_name,
                email,
                password: sub, // Use Google sub as a placeholder password
                profilePicture: picture,
                joinDate: new Date().toISOString()
            });
        }

        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }

        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();

        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id
        });
    } catch (err) {
        res.status(400).send(err);
        return;
    }
};

// Register function
const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profilePicture = `${process.env.BASE_URL}/uploads/default-profile.png`; 
        const user = await userModel.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            profilePicture,
            joinDate: new Date().toISOString        
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Login function
const login = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send('Wrong username or password');
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('Wrong username or password');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        
        // generate token
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });

    } catch (err) {
        res.status(400).send(err);
    }
};

// Get user data
const getUserData = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data', error });
    }
};

// Update user data
const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Update user details
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        if (user.headline !== undefined) user.headline = req.body.headline;
        if (user.bio !== undefined) user.bio = req.body.bio;
        if (user.location !== undefined) user.location = req.body.location;
        if (user.website !== undefined) user.website = req.body.website;
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        if (req.file) {
            user.profilePicture = `${process.env.BASE_URL}/uploads/${req.file.filename}`; // Update profile picture
        } else if (req.body.profilePicture === "null") {
            user.profilePicture = `${process.env.BASE_URL}/uploads/default-profile.png`; // if cleared set default profile picture
        }

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user data', error });
    }
};

// Logout function
const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
    }

    try {
        const user = await verifyRefreshToken(refreshToken);        
        await user.save();
        res.status(200).send("success");
    } catch (err) {
        res.status(400).send("fail");
    }
};

// Refresh function
const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

export default {
    register,
    googleSignIn,
    login,
    getUserData,
    updateUser,
    refresh,
    logout
};