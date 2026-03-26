import { IncomingMessage } from "http";
import { defineConfig, loadEnv, Plugin, PluginOption } from "vite";
import react from "@vitejs/plugin-react";

const readBody = async (req: IncomingMessage) => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};

  try {
    return JSON.parse(raw);
  } catch {
    if (raw.startsWith("\"") && raw.endsWith("\"")) {
      try {
        return JSON.parse(raw.slice(1, -1).replace(/\\\"/g, "\""));
      } catch {
        return {};
      }
    }

    const params = new URLSearchParams(raw);
    const fromParams = Object.fromEntries(params.entries());
    if (Object.keys(fromParams).length > 0) {
      return fromParams;
    }

    return {};
  }
};

const improvePrompt = (mode: "experience" | "summary" | "grammar", input: string) => {
  if (mode === "experience") {
    return `Rewrite the following into 2-3 strong ATS-friendly resume bullet points.\nUse action verbs, include measurable impact, keep concise and professional.\n\nInput:\n${input}\n\nOutput:\n* Bullet 1\n* Bullet 2\n* Bullet 3`;
  }

  if (mode === "summary") {
    return `Rewrite this into a professional 2-line resume summary.\nKeep it concise, impactful, and role-focused.\n\nInput:\n${input}`;
  }

  return `Improve this sentence by replacing weak verbs with strong action verbs and making it more impactful and concise:\n\n${input}`;
};

const devApiPlugin = (groqKey: string): Plugin => ({
  name: "resume-sutra-dev-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const isImprove = req.url === "/api/improve" && req.method === "POST";
      const isJdMatch = req.url === "/api/jd-match" && req.method === "POST";
      if (!isImprove && !isJdMatch) {
        next();
        return;
      }

      try {
        const body = (await readBody(req)) as {
          mode?: "experience" | "summary" | "grammar";
          input?: string;
          jd?: string;
          resume?: string;
        };

        let prompt = "";
        if (isImprove) {
          if (!body.mode || !body.input) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "mode and input are required" }));
            return;
          }
          prompt = improvePrompt(body.mode, body.input);
        }

        if (isJdMatch) {
          if (!body.jd || !body.resume) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "jd and resume are required" }));
            return;
          }
          prompt = `Given this job description and resume content:\n\n1. Extract important keywords\n2. Identify missing keywords\n3. Suggest improvements\n\nJob Description:\n${body.jd}\n\nResume:\n${body.resume}`;
        }

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            messages: [
              {
                role: "system",
                content: "You are an ATS resume optimization assistant. Return concise, professional output.",
              },
              { role: "user", content: prompt },
            ],
          }),
        });

        const payload = (await groqResponse.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const text = payload.choices?.[0]?.message?.content?.trim();

        if (!groqResponse.ok || !text) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Groq request failed in dev API mode" }));
          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(isImprove ? { suggestion: text } : { result: text }));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Local dev API error",
            detail: error instanceof Error ? error.message : String(error),
          }),
        );
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const plugins: PluginOption[] = [react()];
  if (env.GROQ_API_KEY) {
    plugins.push(devApiPlugin(env.GROQ_API_KEY));
  }

  return {
    plugins,
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom", "zustand"],
            pdf: ["html2canvas", "jspdf", "html2pdf.js"],
            http: ["axios"],
          },
        },
      },
    },
    server: {
      port: 5173,
    },
  };
});
