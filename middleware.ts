import {
  clerkMiddleware,
  clerkClient,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// import { authMiddleware } from "@clerk/nextjs/server";
// export default authMiddleware();

const publicRoutes = createRouteMatcher([
  // "/",
  "/api/webhook/register",
  "/sign-up",
  "/sign-in",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // handle unauth users trying to access protected routes
  if (!userId && !publicRoutes(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // user is auth. but check for admin, or not admin
  if (userId) {
    try {
      const user = (await clerkClient()).users.getUser(userId);
      const role = (await user).publicMetadata.role as string | undefined;

      // admin role redirection
      if (role === "admin" && request.nextUrl.pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      // prevent non admin user to access admin dashboard
      if (role !== "admin" && request.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // redirect auth users trying to access public routes
      if (publicRoutes(request)) {
        return NextResponse.redirect(
          new URL(
            role === "admin" ? "/admin/dashboard" : "/dashboard",
            request.url
          )
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.redirect(new URL("/error", request.url));
    }
  }
});

/*
older version. deprecated now.
export default clerkMiddleware({
  async afterAuth(auth, req) {
    if (!auth.userId && !publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  },
});
*/

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
