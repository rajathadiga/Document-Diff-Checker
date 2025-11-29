import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { diffLines } from "diff";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// OpenRouter API setup
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Route: Generate diff + professional AI summary
app.post("/api/diff-summary", async (req, res) => {
  try {
    const { textA, textB } = req.body;

    if (!textA || !textB) {
      return res.status(400).json({ error: "Both documents are required" });
    }

    // Generate diff
    const diff = diffLines(textA, textB);
    const formattedDiff = diff
      .map(part => {
        const sign = part.added ? "+" : part.removed ? "-" : " ";
        return `${sign} ${part.value}`;
      })
      .join("");

    // Upgraded prompt for professional summary
    const prompt = `
You are a professional text comparison and summarization assistant. 
Compare Document A and Document B and generate a clear, concise, professional summary of all differences.

Instructions:
1. Detect all words, phrases, or sentences that were added, removed, or reordered between Document A and B.
2. Highlight any grammatical issues, missing words, or awkward phrasing in Document B.
3. Explain the impact of these changes on the meaning, clarity, and readability of the text.
4. Pay attention to:
   - Greetings, names, and proper nouns
   - Verbs and action phrases
   - Sentence structure and punctuation
   - Word choice and stylistic differences
5. Provide a **corrected and natural version of Document B**, if necessary.
6. Include an **overall summary** explaining the main differences, improvements, or potential issues.
7. Present all points in **numbered or bullet format**, easy to read and understand.
8. Be concise, professional, and actionable—focus on what changed, why it matters, and suggestions for improvement.
9. dont give extreme large summary but Summarizing is very important.

Document A:
${textA}

Document B:
${textB}
`;

    // Call OpenRouter AI
    const aiResponse = await client.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct", // Free model
      messages: [{ role: "user", content: prompt }],
    });

    const summary = aiResponse.choices[0].message.content;

    res.json({
      diff: formattedDiff,
      summary,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
