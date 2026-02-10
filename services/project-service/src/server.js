const app = require("./app");

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
  console.log(`Project Service running on port ${PORT}`);
});
