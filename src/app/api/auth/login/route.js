import { connectDB } from "@/app/lib/connectDB";
import User from "@/app/models/User.model";
import { generateToken } from "@/app/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return Response.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const token = generateToken(user._id);

    return Response.json(
      {
        success: true,
        message: "Login successful",
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
        status: 200,
        headers: {
          // Set token in cookie (optional)
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
        },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);

    return Response.json(
      {
        success: false,
        error: "Login failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
