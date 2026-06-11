import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { model, prompt } = await req.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Debug log
    console.log("OpenRouter Response:", data);

    // Handle OpenRouter errors
    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            data?.error ||
            "OpenRouter request failed",
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json({
      content:
        data?.choices?.[0]?.message?.content ||
        "No content returned",
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}