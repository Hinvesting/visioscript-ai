import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

interface JwtPayload {
  id: string;
  email: string;
  subscriptionStatus: string;
  iat: number;
  exp: number;
}

/**
 * This is a helper function to verify the JWT and get the user ID.
 * We will use this in all of our protected API routes.
 */
export async function verifyJwtAndGetUserId(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return null; // No auth header
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return null; // No token
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined');
    return null; // Server config error
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    return decoded.id; // Return the user ID
  } catch (error) {
    return null; // Invalid token
  }
}
