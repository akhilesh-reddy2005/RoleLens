import { env } from "./env";

export const geminiModel = {
  async generateContent(prompt: string) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.geminiApiKey}`,
      },
      body: JSON.stringify({
        model: env.geminiModel,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${response.statusText} (${errText})`);
    }

    const data = (await response.json()) as any;
    const textContent = data.choices?.[0]?.message?.content || "";

    return {
      response: {
        text: () => textContent,
      },
    };
  },
};
