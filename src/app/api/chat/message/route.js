import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "../../../lib/mongodb";
import Message from "../../../../models/Message";

export async function POST(req) {
  try {
    await connectDB();

    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const token =
      authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const {
      chatId,
      role,
      content,
    } = await req.json();

    const message =
      await Message.create({
        chatId,
        role,
        content,
      });

    return NextResponse.json({
      success: true,
      message,
    });

  } catch (error) {

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