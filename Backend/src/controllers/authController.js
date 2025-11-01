const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Signup controller
const registerUser = async (req, res) => {
  const { name, email, password, phoneNumber, address, farmName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate numeric farmId: get max existing farmId and add 1
    const maxFarm = await User.findOne().sort({ farmId: -1 }).exec();
    let farmId = maxFarm ? maxFarm.farmId + 1 : 1; // start from 1 if no users

    farmId = Number(farmId);
    console.log("Generated farmId:", farmId);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      farmName,
      farmId // Save farmId
    });

    await newUser.save();

    res.status(201).json({ 
      message: "User created successfully",
      farmId 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🟡 Login attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found with that email");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔒 Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 bcrypt.compare result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Password matched!");
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        farmName: user.farmName,
        farmId: user.farmId
      }
    });
  } catch (err) {
    console.error("🔥 Error during login:", err);
    res.status(500).json({ message: err.message });
  }
};
module.exports = { registerUser, loginUser }; 
