import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "../../../lib/mongodb";
import Chat from "../../../../models/Chat";

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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const chats = await Chat.find({
      userId: decoded.userId,
    }).sort({
      updatedAt: -1,
    });

    return NextResponse.json({
      success: true,
      chats,
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