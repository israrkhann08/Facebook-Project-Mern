const express = require('express');
const router = express.Router();
const scrKey = "12345678abc";
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const User = require('../model/userSchema.js');

// random password generate
function password_generator() {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp.padStart(4, '0');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'israr.5aug24webgpt@gmail.com',
        pass: "payj hacj vvyg ksyn"
    }
});

 
router.post("/signup", async (req, res) => {
    try {
        // Check for existing user
        const existingUser = await User.findOne({ name: req.body.name, email: req.body.email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists!"
            });
        }

        // Generate OTP
        const otp = password_generator();

        // Create user
        const userData = req.body;
        const user = new User({
            ...userData,
            otp: otp
        });
        await user.save();

        // Set up email options
        const mailOptions = {
            from: 'israr.5aug24webgpt@gmail.com',
            to: user.email,
            subject: 'OTP Verification',
            text: `Hello ${userData.name},\n\nYour OTP for account verification is: ${otp}\n\nPlease keep it safe.\n\nBest regards.`
        };

        // Send OTP email
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).json({
                    message: "User created, but OTP email failed to send: " + error.message
                });
            }

            // Send success response
            res.status(200).json({
                message: "Signup successful! Please verify your OTP."
            });
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(400).json({ message: "Signup Error: " + error.message });
    }
});

router.post("/otpVerify", async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Validate request body
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        // Find user by email
        const user = await User.findOne({email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Verify OTP
        if (user.otp == otp) {
            console.log(otp,"ot")
            user.otpVerified = true; // Mark user as verified
            user.otp = undefined;    // Clear the OTP
            await user.save();

            return res.status(200).json({ message: "OTP verified successfully." });
        } else {
            return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP: " + error.message });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        if (user.password !== password && user.otpVerified!==false) {
            return res.status(401).send("Invalid password or otp not verified");
        }
        const token = jwt.sign({ email: user.email,id:user._id }, scrKey);
        res.status(200).json({
            message: "User is logged in",
            token: token
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(400).send("Error logging in user: " + error.message);
    }
});

router.post("/passwordForget", async (req, res) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const otp = password_generator();
        user.otp = otp;
        await user.save();
        const mailOptions = {
            from: 'israr.5aug24webgpt@gmail.com',
            to: user.email,
            subject: 'OTP Verification',
            text: `Hello ${user.name},\n\nYour OTP for new password is: ${otp}\n\nPlease verify yourself\n\nBest regards.`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).send("Error sending OTP: " + error.message);
            }
            res.status(200).send("OTP sent successfully. Please verify your OTP.");
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(400).send("Error during password reset: " + error.message);
    }
});

router.post("/againVerify/New_password", async (req, res) => {
    const { email, otp, newpassword } = req.body;

    try {
        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Validate OTP
        if (user.otp == otp) {
            user.otp = undefined; // Clear OTP after successful verification
            user.password = newpassword; // Update password

            await user.save();
            return res.status(200).send("OTP verified successfully. Password is changed.");
        } else {
            return res.status(400).send("Invalid OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).send("Error verifying OTP: " + error.message);
    }
});

module.exports = router;