import { connectDB } from "@/app/lib/connectDB";
import Todo from "@/app/models/Todo.model";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          error: "Invalid todo ID format",
        },
        { status: 400 }
      );
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return Response.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: todo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch todo",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          error: "Invalid todo ID format",
        },
        { status: 400 }
      );
    }

    const { _id, createdAt, updatedAt, __v, ...updateData } = body;

    const todo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return Response.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Todo updated successfully",
        data: todo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);

    if (error.name === "ValidationError") {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
          message: Object.values(error.errors)
            .map((err) => err.message)
            .join(", "),
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Failed to update todo",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          error: "Invalid todo ID format",
        },
        { status: 400 }
      );
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return Response.json(
        {
          success: false,
          error: "Todo not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Todo deleted successfully",
        data: todo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to delete todo",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
