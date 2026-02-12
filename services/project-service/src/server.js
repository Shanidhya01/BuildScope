const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 4003;


connectDB();

app.listen(PORT, () => {
  console.log(`Project Service running on port ${PORT}`);
});
