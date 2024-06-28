import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("user-token");

  if (token) {
    try {
      // Vérifiez le jeton JWT
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      // Si l'utilisateur est authentifié, redirigez-le vers le quiz
      return NextResponse.redirect(new URL("/quiz", request.url));
    } catch (error) {
      // Si le jeton est invalide, continuez vers la page d'inscription
      console.error("Invalid token:", error);
      return NextResponse.next();
    }
  } else {
    // Si aucun jeton n'est trouvé, continuez vers la page d'inscription
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/"],
};
