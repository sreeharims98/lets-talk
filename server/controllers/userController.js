import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../common/generateToken.js";

export const getAllUsers = async (req, res) => {
  try {
    // exclude: requesting user, all password field
    const allUsers = await userModel.find({ _id: { $ne: req.user.id } }, { password: 0 });

    res.json(allUsers);
  } catch (error) {
    res.status(400).json({ message: "Users not found !" });
  }
};

export const getUserByToken = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id, { password: 0 });

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "User not found !" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check data
    if (!email || !password) {
      res.status(400);
      throw new Error("Email or password not found");
    }

    //check for user email
    const user = await userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const userNew = {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      };
      res.json(userNew);
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const postUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check all fields
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }
    //check if user already exists
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      res.status(400);
      throw new Error("This email already exists");
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      const userNew = {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      };
      res.status(201).json(userNew);
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const putUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    user.username = req.body.username;
    await user.save();
    res.json({ message: "User updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userModel.deleteOne({ _id: req.params.id });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
