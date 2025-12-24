import jwt from "jsonwebtoken";

// Secret key for JWT
const JWT_SECRET =
  process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

// Generate JWT token
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// Extract token from Authorization header
export function getTokenFromHeader(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7); // Remove "Bearer " prefix
}

// Extract token from cookies
export function getTokenFromCookies(request) {
  const cookies = request.headers.get("cookie");

  if (!cookies) {
    return null;
  }

  const tokenCookie = cookies
    .split(";")
    .find((c) => c.trim().startsWith("token="));

  if (!tokenCookie) {
    return null;
  }

  return tokenCookie.split("=")[1];
}

// Get user ID from request (tries both header and cookies)
export function getUserIdFromRequest(request) {
  // Try Authorization header first
  let token = getTokenFromHeader(request);

  // If not found, try cookies
  if (!token) {
    token = getTokenFromCookies(request);
  }

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

// Middleware function to verify authentication
export function requireAuth(request) {
  const userId = getUserIdFromRequest(request);

  if (!userId) {
    return {
      authenticated: false,
      error: "Authentication required",
      userId: null,
    };
  }

  return {
    authenticated: true,
    error: null,
    userId,
  };
}
