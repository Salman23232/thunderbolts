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
import { NextResponse } from "next/server";

// Setup OpenRouter client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req) {
  const { prompt } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: "openai/gpt-3.5-turbo", // supports streaming
          stream: true,
          messages: [{ role: "user", content: prompt }],
        });

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      } catch (err) {
        console.error("Stream error:", err);
        controller.enqueue(encoder.encode("❌ Error generating code."));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
 
