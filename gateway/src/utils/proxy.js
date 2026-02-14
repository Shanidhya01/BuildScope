module.exports = {
  auth: "http://auth:4001",
  ai: "http://ai:4002",
  projects: process.env.PROJECTS_SERVICE_URL || "http://projects:4003",
  export: "http://export:4004"
};
