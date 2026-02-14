module.exports = {
  auth: process.env.AUTH_SERVICE_URL || "http://auth:4001",
  ai: process.env.AI_SERVICE_URL || "http://ai:4002",
  projects: process.env.PROJECTS_SERVICE_URL || "http://projects:4003",
  export: process.env.EXPORT_SERVICE_URL || "http://export:4004"
};