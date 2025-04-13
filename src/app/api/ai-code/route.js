// import { NextRequest, NextResponse } from "next/server";
// import { GenAiCode } from "../../../../configs/GeminiApi";

// export async function POST(req) {
//   try {
//     const { prompt } = await req.json();

//     const response = await GenAiCode.sendMessage(prompt);
//     const result = await response.response.text();

//     return NextResponse.json(JSON.parse(result)); // ✅ fixed this line

//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json({ error: "Internal Server Error", message: error.message });
//   }
// }

import OpenAI from "openai";

// Initialize OpenAI instance using OpenRouter API endpoint
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // Specify OpenRouter base URL
});

export async function POST(req) {
  const body = await req.json();
  const prompt = body.prompt;

  try {
    // Using OpenRouter to call the API and get AI response
    const response = await openai.chat.completions.create({
      model: "openrouter/optimus-alpha",
      // You can choose the model you want (e.g., "mistral-7b", "gemma", etc.)
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content;
    const parsedResult = JSON.parse(result)

    // Send the AI response back
    return new Response( JSON.stringify(parsedResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("❌ OpenRouter API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
