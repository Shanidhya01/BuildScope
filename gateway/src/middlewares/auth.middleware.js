const admin = require("../config/firebase");

const verifyAuth = async (req, res, next) => {
  if (process.env.SKIP_FIREBASE_AUTH === "true") {
    req.user = { uid: "dev-user" };
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyAuth;
