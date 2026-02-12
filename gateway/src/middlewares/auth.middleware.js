const axios = require("axios");

const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const response = await axios.post(
      "http://auth:4001/auth/verify",
      {},
      { headers: { Authorization: token } }
    );

    req.user = response.data.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyAuth;
