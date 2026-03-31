var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
var readBody = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var chunks, chunk, e_1_1, raw, params, fromParams;
    var _a, req_1, req_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                chunks = [];
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, 7, 12]);
                _a = true, req_1 = __asyncValues(req);
                _e.label = 2;
            case 2: return [4 /*yield*/, req_1.next()];
            case 3:
                if (!(req_1_1 = _e.sent(), _b = req_1_1.done, !_b)) return [3 /*break*/, 5];
                _d = req_1_1.value;
                _a = false;
                chunk = _d;
                chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
                _e.label = 4;
            case 4:
                _a = true;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _e.trys.push([7, , 10, 11]);
                if (!(!_a && !_b && (_c = req_1.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _c.call(req_1)];
            case 8:
                _e.sent();
                _e.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12:
                raw = Buffer.concat(chunks).toString("utf8");
                if (!raw.trim())
                    return [2 /*return*/, {}];
                try {
                    return [2 /*return*/, JSON.parse(raw)];
                }
                catch (_f) {
                    if (raw.startsWith("\"") && raw.endsWith("\"")) {
                        try {
                            return [2 /*return*/, JSON.parse(raw.slice(1, -1).replace(/\\"/g, "\""))];
                        }
                        catch (_g) {
                            return [2 /*return*/, {}];
                        }
                    }
                    params = new URLSearchParams(raw);
                    fromParams = Object.fromEntries(params.entries());
                    if (Object.keys(fromParams).length > 0) {
                        return [2 /*return*/, fromParams];
                    }
                    return [2 /*return*/, {}];
                }
                return [2 /*return*/];
        }
    });
}); };
var improvePrompt = function (mode, input) {
    if (mode === "experience") {
        return "Rewrite the following into 2-3 strong ATS-friendly resume bullet points.\nUse action verbs, include measurable impact, keep concise and professional.\n\nInput:\n".concat(input, "\n\nOutput:\n* Bullet 1\n* Bullet 2\n* Bullet 3");
    }
    if (mode === "summary") {
        return "Rewrite this into a professional 2-line resume summary.\nKeep it concise, impactful, and role-focused.\n\nInput:\n".concat(input);
    }
    if (mode === "recruiter") {
        return "You are a recruiter doing a strict 30-second resume screen.\nBased on the resume text below, respond in exactly this format:\nWould shortlist?: Yes/No\nTop 3 concerns:\n1) ...\n2) ...\n3) ...\nFast fixes:\n1) ...\n2) ...\n3) ...\n\nKeep each point short and practical.\n\nResume Text:\n".concat(input);
    }
    return "Improve this sentence by replacing weak verbs with strong action verbs and making it more impactful and concise:\n\n".concat(input);
};
var devApiPlugin = function (groqKey) { return ({
    name: "resume-sutra-dev-api",
    configureServer: function (server) {
        var _this = this;
        server.middlewares.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var isImprove, isJdMatch, body, prompt_1, groqResponse, payload, text, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        isImprove = req.url === "/api/improve" && req.method === "POST";
                        isJdMatch = req.url === "/api/jd-match" && req.method === "POST";
                        if (!isImprove && !isJdMatch) {
                            next();
                            return [2 /*return*/];
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, readBody(req)];
                    case 2:
                        body = (_e.sent());
                        prompt_1 = "";
                        if (isImprove) {
                            if (!body.mode || !body.input) {
                                res.statusCode = 400;
                                res.setHeader("Content-Type", "application/json");
                                res.end(JSON.stringify({ error: "mode and input are required" }));
                                return [2 /*return*/];
                            }
                            prompt_1 = improvePrompt(body.mode, body.input);
                        }
                        if (isJdMatch) {
                            if (!body.jd || !body.resume) {
                                res.statusCode = 400;
                                res.setHeader("Content-Type", "application/json");
                                res.end(JSON.stringify({ error: "jd and resume are required" }));
                                return [2 /*return*/];
                            }
                            prompt_1 = "Given this job description and resume content:\n\n1. Extract important keywords\n2. Identify missing keywords\n3. Suggest improvements\n\nJob Description:\n".concat(body.jd, "\n\nResume:\n").concat(body.resume);
                        }
                        return [4 /*yield*/, fetch("https://api.groq.com/openai/v1/chat/completions", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer ".concat(groqKey),
                                },
                                body: JSON.stringify({
                                    model: "llama-3.3-70b-versatile",
                                    temperature: 0.3,
                                    messages: [
                                        {
                                            role: "system",
                                            content: "You are an ATS resume optimization assistant. Return concise, professional output.",
                                        },
                                        { role: "user", content: prompt_1 },
                                    ],
                                }),
                            })];
                    case 3:
                        groqResponse = _e.sent();
                        return [4 /*yield*/, groqResponse.json()];
                    case 4:
                        payload = (_e.sent());
                        text = (_d = (_c = (_b = (_a = payload.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim();
                        if (!groqResponse.ok || !text) {
                            res.statusCode = 502;
                            res.setHeader("Content-Type", "application/json");
                            res.end(JSON.stringify({ error: "Groq request failed in dev API mode" }));
                            return [2 /*return*/];
                        }
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify(isImprove ? { suggestion: text } : { result: text }));
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _e.sent();
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify({ error: "Local dev API error" }));
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
    },
}); };
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var plugins = [react()];
    if (env.GROQ_API_KEY) {
        plugins.push(devApiPlugin(env.GROQ_API_KEY));
    }
    return {
        plugins: plugins,
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
