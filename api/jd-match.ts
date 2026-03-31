import type { VercelRequest, VercelResponse } from "@vercel/node";

const MAX_JD_LENGTH = 8000;
const MAX_RESUME_LENGTH = 12000;

function setApiSecurityHeaders(res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
}

function parseRequestBody(req: VercelRequest): Record<string, unknown> | null {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  if (typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }

  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setApiSecurityHeaders(res);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing GROQ_API_KEY" });
    return;
  }

  const body = parseRequestBody(req);
  if (!body) {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const jd = (body?.jd ?? "").toString().trim();
  const resume = (body?.resume ?? "").toString().trim();

  if (!jd || !resume) {
    res.status(400).json({ error: "Both jd and resume are required" });
    return;
  }

  if (jd.length > MAX_JD_LENGTH || resume.length > MAX_RESUME_LENGTH) {
    res.status(413).json({ error: "Input too large" });
    return;
  }

  const prompt = `Given this job description and resume content:\n\n1. Extract important keywords\n2. Identify missing keywords\n3. Suggest improvements\n\nJob Description:\n${jd}\n\nResume:\n${resume}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are an ATS optimizer. Return clear sections: Keywords, Missing Keywords, Suggested Improvements.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      res.status(502).json({ error: "Groq request failed" });
      return;
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const result = json.choices?.[0]?.message?.content?.trim();
    if (!result) {
      res.status(502).json({ error: "Empty AI response" });
      return;
    }

    res.status(200).json({ result });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}
