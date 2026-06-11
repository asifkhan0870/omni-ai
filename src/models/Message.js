import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },

    role: String,

    content: String,
  },
  {
    timestamps: true,
  }
);

export default
  mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);