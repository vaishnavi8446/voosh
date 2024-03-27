const express = require("express");
const router = express.Router();
const User = require("./../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { verifyToken } = require("./../middleware/token");



/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User registered successfully
 *       500:
 *         description: Error registering user
 */


router.post("/register", async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await user.save();
    return res.status(200).json({
      status_code: 200,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Error logging in
 */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = jwt.sign({ userId: user._id }, "secretkey");
    res
      .status(200)
      .json({ status_code: 200, msg: "Login successful!", token: token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

/**
 * @swagger
 * /user/getProfile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Fetch user profile successfully
 *       500:
 *         description: Error fetching user profile
 */
router.get("/getProfile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User not found");
    }
    return res.status(200).json({
      status_code: 200,
      message: "Fetch user profiles successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /user/updateProfile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *               photo:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       500:
 *         description: Error updating user profile
 */
router.put("/updateProfile", verifyToken, async (req, res) => {
  try {
    const { name, bio, phone, photo, isPublic } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.profile.name = name;
    user.profile.bio = bio;
    user.profile.phone = phone;
    user.profile.photo = photo;
    user.isPublic = isPublic;
    await user.save();
    return res.status(200).json({
      status_code: 200,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /user/admin/profiles:
 *   get:
 *     summary: Get all user profiles (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Fetch all user profiles successfully
 *       500:
 *         description: Error fetching user profiles
 */

router.get("/admin/profiles", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      throw new Error("Unauthorized");
    }
    const profiles = await User.find();
    return res.status(200).json({
      status_code: 200,
      message: "Fetch all user profiles successfully",
      data: profiles,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /user/public/profiles:
 *   get:
 *     summary: Get public user profiles
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Fetch public user profiles successfully
 *       500:
 *         description: Error fetching public user profiles
 */
router.get("/public/profiles", async (req, res) => {
  try {
    const profiles = await User.find({ isPublic: true });
    return res.status(200).json({
      status_code: 200,
      message: "Fetch public user profiles successfully",
      data: profiles,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
