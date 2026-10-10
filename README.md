# CareerForge AI — Simplified & Direct n8n Integration

**CareerForge AI** is a focused, clean web tool to tailor LaTeX resumes using your live **n8n Cloud workflow**.

---

## ⚡ Direct n8n Setup

1. Open **[http://localhost:5173](http://localhost:5173)**.
2. In the top **n8n Webhook** bar, paste your n8n Production Webhook URL (e.g. `https://your-workspace.app.n8n.cloud/webhook/careerforge-tailor`).
3. Click **Test Webhook** to confirm your endpoint is reachable.
4. Upload or paste your Master Resume `.tex` on the left, paste the target Job Description on the right, and click **Tailor Resume via n8n**.

---

## 📬 What CareerForge AI sends to your n8n Webhook (HTTP POST)

```json
{
  "masterResumeTex": "\\documentclass{article} ... \\end{document}",
  "jobDescription": "Full job description text...",
  "targetRole": "Senior Software Engineer",
  "targetCompany": "Target Company",
  "timestamp": "2026-10-10T14:00:00.000Z"
}
```

---

## 📥 Expected Response from your n8n Webhook (JSON)

Your n8n workflow (e.g., using a **Respond to Webhook** node) should return:

```json
{
  "tailoredTex": "\\documentclass{article} ... \\end{document}",
  "matchScore": 85,
  "summary": "Executive summary of alignment",
  "matchedRequirements": [
    {
      "requirement": "React & TypeScript",
      "sourceEvidence": "Built real-time client dashboards"
    }
  ],
  "missingRequirements": [
    {
      "requirement": "Apache Kafka",
      "recommendation": "Mention message queue fundamentals; do not fabricate"
    }
  ],
  "tailoringRecommendations": [
    {
      "area": "Skills section",
      "suggestion": "Elevate PostgreSQL to primary position"
    }
  ],
  "changesApplied": [
    {
      "section": "Experience",
      "reasoning": "Emphasized financial transaction throughput"
    }
  ]
}
```

*(Note: The frontend also gracefully supports simpler responses, such as `{ "tailoredTex": "..." }` or plain LaTeX)*.

---

## 🛠️ n8n Webhook Node Settings

- **HTTP Method**: `POST`
- **Path**: `careerforge-tailor` (or your chosen path)
- **Response Mode**: `Using 'Respond to Webhook' Node`
- **Allowed Origins (CORS)**: Set to `*` to allow browser `fetch` requests.
