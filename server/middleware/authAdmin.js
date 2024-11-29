const Users = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({ _id: req.user.id });

    if(user.role === "user")
        return res.status(400).json({msg: "Admin Resources access denied"});

    next();
  } catch (error) {
    return res.status(500).json({msg: error.message});
  }
};

module.exports = authAdmin;