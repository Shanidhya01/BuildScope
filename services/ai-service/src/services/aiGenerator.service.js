const { buildPrompt } = require("./promptBuilder.service");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const generateBlueprint = async (idea) => {
  try {
    console.log("🟢 Starting OpenRouter call...");

    const prompt = buildPrompt(idea);

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8080",
        "X-Title": "BuildScope"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      })
    });

    console.log("🟢 OpenRouter responded:", response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error("🔴 OpenRouter Error:", data);
      throw new Error("OpenRouter API error");
    }

    let text = data?.choices?.[0]?.message?.content || "";

    if (!text) {
      throw new Error("Empty response from OpenRouter");
    }

    // Remove markdown formatting
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("🟢 Parsing blueprint JSON");

    const parsed = JSON.parse(text);

    console.log("🟢 Blueprint generated successfully");

    return parsed;

  } catch (error) {
    console.error("🔴 AI Generation Failed:", error.message);
    throw error;
  }
};

module.exports = { generateBlueprint };
