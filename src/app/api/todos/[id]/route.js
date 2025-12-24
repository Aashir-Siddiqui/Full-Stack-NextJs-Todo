import { connectDB } from "@/app/lib/connectDB";
import Todo from "@/app/models/Todo.model";
import { requireAuth } from "@/app/lib/auth";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const auth = requireAuth(request);
    if (!auth.authenticated) {
      return Response.json(
        {
          success: false,
          error: auth.error,
        },
        { status: 401 }
      );
    }

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

    // Find todo and verify ownership
    const todo = await Todo.findOne({
      _id: id,
      userId: auth.userId,
    });

    if (!todo) {
      return Response.json(
        {
          success: false,
          error: "Todo not found or you don't have permission",
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
    console.error("GET Todo Error:", error);
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

    const auth = requireAuth(request);
    if (!auth.authenticated) {
      return Response.json(
        {
          success: false,
          error: auth.error,
        },
        { status: 401 }
      );
    }

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

    // Prevent modification of protected fields
    const { _id, userId, createdAt, updatedAt, __v, ...updateData } = body;

    // Update todo and verify ownership
    const todo = await Todo.findOneAndUpdate(
      {
        _id: id,
        userId: auth.userId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!todo) {
      return Response.json(
        {
          success: false,
          error: "Todo not found or you don't have permission",
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
    console.error("PUT Todo Error:", error);

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

    const auth = requireAuth(request);
    if (!auth.authenticated) {
      return Response.json(
        {
          success: false,
          error: auth.error,
        },
        { status: 401 }
      );
    }

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

    // Delete todo and verify ownership
    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: auth.userId,
    });

    if (!todo) {
      return Response.json(
        {
          success: false,
          error: "Todo not found or you don't have permission",
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
    console.error("DELETE Todo Error:", error);
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
