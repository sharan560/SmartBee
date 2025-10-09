const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

async function generateFarmNumber() {
  const count = await User.countDocuments();
  return `FARM${(count + 1).toString().padStart(5, '0')}`;
}

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, farmName } = req.body;

    if (!name || !email || !password || !phoneNumber || !address || !farmName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const farmID = await generateFarmNumber();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      farmName,
      farmID
    });

    await user.save();

    res.status(201).json({ message: "Registration successful", farmID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
