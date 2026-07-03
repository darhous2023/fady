import { NextRequest } from "next/server";
import { auth } from "@/utils/auth";

export async function getSessionFromRequest(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return session;
  } catch {
    return null;
  }
}
