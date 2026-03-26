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
var promptByMode = {
    experience: "Rewrite the following into 2-3 strong ATS-friendly resume bullet points. Use action verbs, include measurable impact, keep concise and professional.\n\nInput:\n{user_text}\n\nOutput:\n* Bullet 1\n* Bullet 2\n* Bullet 3",
    summary: "Rewrite this into a professional 2-line resume summary. Keep it concise, impactful, and role-focused.\n\nInput:\n{user_text}",
    grammar: "Improve this sentence by replacing weak verbs with strong action verbs and making it more impactful and concise:\n\n{user_text}",
};
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, body, mode, input, userPrompt, response, errorText, json, suggestion, error_1;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (req.method !== "POST") {
                        res.status(405).json({ error: "Method not allowed" });
                        return [2 /*return*/];
                    }
                    apiKey = process.env.GROQ_API_KEY;
                    if (!apiKey) {
                        res.status(500).json({ error: "Missing GROQ_API_KEY" });
                        return [2 /*return*/];
                    }
                    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
                    mode = body === null || body === void 0 ? void 0 : body.mode;
                    input = ((_a = body === null || body === void 0 ? void 0 : body.input) !== null && _a !== void 0 ? _a : "").toString().trim();
                    if (!mode || !(mode in promptByMode)) {
                        res.status(400).json({ error: "Invalid mode" });
                        return [2 /*return*/];
                    }
                    if (!input) {
                        res.status(400).json({ error: "Input is required" });
                        return [2 /*return*/];
                    }
                    userPrompt = promptByMode[mode].replace("{user_text}", input);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("https://api.groq.com/openai/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(apiKey),
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
                        })];
                case 2:
                    response = _f.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorText = _f.sent();
                    res.status(response.status).json({ error: "Groq request failed", detail: errorText });
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    json = (_f.sent());
                    suggestion = (_e = (_d = (_c = (_b = json.choices) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.trim();
                    if (!suggestion) {
                        res.status(502).json({ error: "Empty AI response" });
                        return [2 /*return*/];
                    }
                    res.status(200).json({ suggestion: suggestion });
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _f.sent();
                    res.status(500).json({ error: "Internal server error", detail: error_1 instanceof Error ? error_1.message : String(error_1) });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
