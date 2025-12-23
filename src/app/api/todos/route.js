import { connectDB } from "@/app/lib/connectDB";
import Todo from "@/app/models/Todo.model";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const completed = searchParams.get("completed");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "-createdAt";

    let query = {};
    if (completed !== null && completed !== undefined) {
      query.completed = completed === "true";
    }
    if (priority) {
      query.priority = priority;
    }
    if (category) {
      query.category = category;
    }

    const todos = await Todo.find(query).sort(sort).lean();

    return Response.json(
      {
        success: true,
        count: todos.length,
        data: todos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch todos",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    if (!body.text || body.text.trim() === "") {
      return Response.json(
        {
          success: false,
          error: "Todo text is required",
        },
        { status: 400 }
      );
    }

    const todo = await Todo.create({
      text: body.text.trim(),
      completed: body.completed || false,
      priority: body.priority || "medium",
      category: body.category || "general",
    });

    return Response.json(
      {
        success: true,
        message: "Todo created successfully",
        data: todo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);

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
        error: "Failed to create todo",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
