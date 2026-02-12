const buildPrompt = (idea) => {
  return `
You are a senior software architect.

Generate a structured project blueprint in STRICT JSON format.

Return ONLY valid JSON. No markdown. No explanation.

Structure:

{
  "features": {
    "roles": [],
    "mvp": [],
    "advanced": []
  },
  "techStack": {
    "frontend": "",
    "backend": "",
    "database": "",
    "auth": ""
  },
  "database": {
    "collections": []
  },
  "apis": [],
  "timeline": []
}

Project Idea:
${idea}
`;
};

module.exports = { buildPrompt };
