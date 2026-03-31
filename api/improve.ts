type ImproveMode = "experience" | "summary" | "grammar" | "recruiter";

const promptByMode: Record<ImproveMode, string> = {
  experience:
    "Rewrite the following into 2-3 strong ATS-friendly resume bullet points. Use action verbs, include measurable impact, keep concise and professional.\n\nInput:\n{user_text}\n\nOutput:\n* Bullet 1\n* Bullet 2\n* Bullet 3",
  summary:
    "Rewrite this into a professional 2-line resume summary. Keep it concise, impactful, and role-focused.\n\nInput:\n{user_text}",
  grammar:
    "Improve this sentence by replacing weak verbs with strong action verbs and making it more impactful and concise:\n\n{user_text}",
  recruiter:
    "You are a recruiter doing a strict 30-second resume screen. Based on the resume text below, respond in exactly this format:\nWould shortlist?: Yes/No\nTop 3 concerns:\n1) ...\n2) ...\n3) ...\nFast fixes:\n1) ...\n2) ...\n3) ...\n\nKeep each point short and practical.\n\nResume Text:\n{user_text}",
};

const MAX_INPUT_LENGTH = 4000;

function setApiSecurityHeaders(res: any) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
}

function parseRequestBody(req: any): Record<string, unknown> | null {
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

export default async function handler(req: any, res: any) {
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

  const mode = body?.mode as ImproveMode;
  const input = (body?.input ?? "").toString().trim();

  if (!mode || !(mode in promptByMode)) {
    res.status(400).json({ error: "Invalid mode" });
    return;
  }

  if (!input) {
    res.status(400).json({ error: "Input is required" });
    return;
  }

  if (input.length > MAX_INPUT_LENGTH) {
    res.status(413).json({ error: "Input too large" });
    return;
  }

  const userPrompt = promptByMode[mode].replace("{user_text}", input);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "You are a resume optimization expert. Return concise, ATS-ready output.",
          },
          {
            role: "user",
            content: userPrompt,
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

    const suggestion = json.choices?.[0]?.message?.content?.trim();
    if (!suggestion) {
      res.status(502).json({ error: "Empty AI response" });
      return;
    }

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("/api/improve failed", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
