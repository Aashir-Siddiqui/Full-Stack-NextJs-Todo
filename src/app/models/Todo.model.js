import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Todo text is required"],
      trim: true,
      minlength: [1, "Todo text cannot be empty"],
      maxlength: [500, "Todo text cannot exceed 500 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      default: "general",
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add index for better query performance
todoSchema.index({ completed: 1, createdAt: -1 });

// Prevent model recompilation in development
const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
