const admin = require("../config/firebase");

const verifyToken = async (token) => {
  if (process.env.SKIP_FIREBASE_AUTH === "true") {
    return { uid: "dev-user", token };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = { verifyToken };
