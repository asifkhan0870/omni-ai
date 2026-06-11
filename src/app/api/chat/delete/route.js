import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Chat from "../../../../models/Chat";
import Message from "../../../../models/Message";

export async function DELETE(req) {
  await connectDB();

  const { chatId } =
    await req.json();

  await Message.deleteMany({
    chatId,
  });

  await Chat.findByIdAndDelete(
    chatId
  );

  return NextResponse.json({
    success: true,
  });
}