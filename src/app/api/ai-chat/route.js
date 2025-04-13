// // app/api/ai-chat/route.js
// import { NextResponse } from "next/server";
// import { chatSession } from "../../../../configs/GeminiApi";

// export const POST = async (req) => {
//   const { prompt } = await req.json();
//   try {
//     const result = await chatSession.sendMessage(prompt);
//     const response = await result.response.text();
//     console.log(response);

//     return NextResponse.json({ result: response });
//   } catch (error) {
//     console.error("AI Error:", error);
//     return NextResponse.json(
//       { error: error.message || "AI error occurred" },
//       { status: 500 }
//     );
//   }
// };

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
      model: "openai/gpt-3.5-turbo",
      // You can choose the model you want (e.g., "mistral-7b", "gemma", etc.)
      messages: [{ role: "user", content: prompt }],
    });

    const result = response.choices[0].message.content;

    // Send the AI response back
    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ OpenRouter API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
