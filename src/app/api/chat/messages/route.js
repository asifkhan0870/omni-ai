import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "../../../lib/mongodb";
import Message from "../../../../models/Message";

export async function GET(req) {
  try {
    await connectDB();

    const authHeader =
      req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token =
      authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const chatId =
      req.nextUrl.searchParams.get(
        "chatId"
      );

    const messages =
      await Message.find({
        chatId,
      }).sort({
        createdAt: 1,
      });

    return NextResponse.json({
      success: true,
      messages,
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