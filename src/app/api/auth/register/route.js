import { connectDB } from "@/app/lib/connectDB";
import User from "@/app/models/User.model";
import { generateToken } from "@/app/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        {
          success: false,
          error: "Email already registered",
        },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    return Response.json(
      {
        success: true,
        message: "Registration successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
        },
      },
      {
        status: 201,
        headers: {
          // Set token in cookie (optional)
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
        },
      }
    );
  } catch (error) {
    console.error("Register Error:", error);

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
        error: "Registration failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
