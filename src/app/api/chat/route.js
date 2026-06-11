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
          stream: true,

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    // IMPORTANT
    if (!response.ok) {
      let errorText = "";

      try {
        const errorData = await response.json();

        errorText =
          errorData?.error?.message ||
          errorData?.message ||
          "";
      } catch {}

      if (
        response.status === 401 ||
        response.status === 402 ||
        response.status === 429
      ) {
        return NextResponse.json(
          {
            error:
              "⚠️ AI credits have been exhausted. Please try again later.",
          },
          {
            status: 429,
          }
        );
      }

      return NextResponse.json(
        {
          error:
            errorText ||
            "AI service temporarily unavailable.",
        },
        {
          status: response.status,
        }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Unable to connect to AI service.",
      },
      {
        status: 500,
      }
    );
  }
}