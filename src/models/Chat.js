import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,

    model: String,
  },
  {
    timestamps: true,
  }
);

export default
  mongoose.models.Chat ||
  mongoose.model("Chat", ChatSchema);