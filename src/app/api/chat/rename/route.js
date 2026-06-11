import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Chat from "../../../../models/Chat";

export async function PUT(req) {
  await connectDB();

  const { chatId, title } =
    await req.json();

  await Chat.findByIdAndUpdate(
    chatId,
    { title }
  );

  return NextResponse.json({
    success: true,
  });
}