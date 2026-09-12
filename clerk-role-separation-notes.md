# Clerk role separation notes

The current workspace `.env` only contains the Clerk publishable and secret keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

No Clerk role values, role claims, `admin` flags, or role-separation example are present in this repo.

The repo’s visible Clerk wiring is limited to the provider and auth UI in `app/layout.tsx`:

```tsx
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
```

The middleware in `proxy.ts` is currently:

```ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
```

That means this app has only baseline Clerk sign-in/sign-up UI and middleware, not a role-separation enforcement layer.

## Simple way to implement role separation

Use Clerk user public metadata to assign a role such as `user` or `admin`.

Example server check:

```ts
import { currentUser } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) throw new Error("Not signed in");
  if (user.publicMetadata.role !== "admin") throw new Error("Forbidden");
}
```

Example route/middleware gate:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || user?.publicMetadata.role !== "admin") {
      return Response.redirect(new URL("/sign-in", req.url));
    }
  }
});
```

## Practical simplicity

This is a straightforward project addition:

- Add role metadata to the Clerk user (`publicMetadata.role = 'admin' | 'user'`).
- Enforce that check in middleware or in a server-side helper.
- Restrict admin-only UI or API behavior behind the same check.

It is very simple for a one-app setup, and only becomes more complex if you need organization-level roles, permission scopes, or role inheritance.
