const generateMarkdown = (project) => {
  const { idea, blueprint } = project;

  return `
# ${idea}

## Features (MVP)
${blueprint.features.mvp.map(f => `- ${f}`).join("\n")}

## Tech Stack
- Frontend: ${blueprint.techStack.frontend}
- Backend: ${blueprint.techStack.backend}
- Database: ${blueprint.techStack.database}
- Auth: ${blueprint.techStack.auth}

## Database Collections
${blueprint.database.collections.map(c => `- ${c}`).join("\n")}
`;
};

module.exports = generateMarkdown;
