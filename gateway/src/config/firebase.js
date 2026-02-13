const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const getCredential = () => {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (rawJson) {
    const parsed = JSON.parse(rawJson);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return admin.credential.cert(parsed);
  }

  const localPath = path.resolve(__dirname, "../../firebase-service-account.json");
  if (fs.existsSync(localPath)) {
    const serviceAccount = require(localPath);
    return admin.credential.cert(serviceAccount);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return admin.credential.applicationDefault();
  }

  return null;
};

if (!admin.apps.length) {
  const credential = getCredential();
  if (credential) {
    admin.initializeApp({ credential });
  } else {
    admin.initializeApp();
    console.warn("Firebase Admin initialized without explicit credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON for token verification.");
  }
}

module.exports = admin;
