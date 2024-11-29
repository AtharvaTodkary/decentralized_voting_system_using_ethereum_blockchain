const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { voterId, password, role } = req.body;

      const user = await Users.findOne({ voterId });
      if (user)
        return res.status(400).json({ msg: "Voter Already Registered" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 character" });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        voterId,
        password: passwordHash,
        role,
      });

      await newUser.save();

      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshtoken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(403).json({ msg: "please login again" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please login again" });

        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { voterId, password } = req.body;

      const user = await Users.findOne({ voterId });
      if (!user) return res.status(400).json({ msg: "voter doesn't exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ msg: "Incorrect password" });

      const accesstoken = createAccessToken({
        voterId: user._id,
        // voterId: user.voterId,
        // role: user.role,
      });
      const refreshtoken = createRefreshToken({
        voterId: user._id,
        // voterId: user.voterId,
        // role: user.role,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logout success" });
    } catch (error) {
      return res.status(500).json({ msg: `Logout error : ${error.message}` });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
