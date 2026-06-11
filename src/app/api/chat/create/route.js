import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "../../../lib/mongodb";
import Chat from "../../../../models/Chat";

export async function POST(req) {
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

    const { title, model } =
      await req.json();

    const chat = await Chat.create({
      userId: decoded.userId,
      title,
      model,
    });

    return NextResponse.json({
      success: true,
      chat,
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