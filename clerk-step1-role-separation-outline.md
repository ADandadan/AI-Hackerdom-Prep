# Step 1: Add Clerk role metadata

This is a beginner-friendly outline for setting up role separation in a Clerk app where the two roles are:

- `org:admin`
- `org:member`

The goal is to make each signed-in user carry a role so your app knows what that user is allowed to do.

## What this step means

Role separation means the app does not treat every user as the same.

For example:

- `org:admin` can manage the organization.
- `org:member` can join the organization and view normal content.

In Clerk, the easiest beginner method is to store the role in the user’s `publicMetadata`.

## Where the role belongs

For Step 1, the role should not be stored in UI state, not in a React component, and not in the environment file. It belongs in the Clerk user record’s `publicMetadata` object.

This means the exact field structure you want is:

```ts
publicMetadata.role = "org:admin";
```

or

```ts
publicMetadata.role = "org:member";
```

That is the field the app will later read from the Clerk user object.

## What file to add it to

There are two practical places to do Step 1:

### Option A: Clerk Dashboard

Go to your Clerk application in the Dashboard.

Find the user profile or organization member settings.

Add this field manually in the user’s `publicMetadata`:

```json
{
  "role": "org:admin"
}
```

or

```json
{
  "role": "org:member"
}
```

This is the easiest way for a beginner because the role is stored directly in the Clerk user record instead of being invented inside the app.

### Option B: A server/admin file

If you want code to assign the role, create or update an admin setup file such as a server route or script file. Example:

```ts
// app/api/admin/set-role/route.ts
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const body = await request.json();
  const userId = body.userId;
  const role = body.role;

  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      role,
    },
  });
}
```

Important: in this repository, the files already visible are:

- `.env` for Clerk keys
- `proxy.ts` for Clerk middleware
- `app/layout.tsx` for the ClerkProvider UI wrapper

You do not add the role value into `.env`. The role belongs in the Clerk user object, not the environment file. The `.env` only holds:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## What field to add

The field name should be exactly:

```ts
publicMetadata.role;
```

The value must be one of the two allowed values:

```ts
"org:admin";
```

or

```ts
"org:member";
```

Do not write the role as a plain local variable like:

```ts
const role = "org:admin";
```

That is just temporary in the browser. It will not protect your app.

## What the user record should look like

After Step 1, the Clerk user record should have a structure like this:

```json
{
  "id": "user_123",
  "publicMetadata": {
    "role": "org:admin"
  }
}
```

or

```json
{
  "id": "user_456",
  "publicMetadata": {
    "role": "org:member"
  }
}
```

## Why this field belongs here

The reason `publicMetadata.role` is the right place is:

1. It is attached to the Clerk user record.
2. It is readable by the server.
3. It can later be checked by authentication or middleware.
4. It separates the UI and backend into a consistent role model.

## Beginner implementation checklist

For Step 1, make sure you have:

- [ ] An existing Clerk user in the Clerk Dashboard or app
- [ ] A `publicMetadata` object on that user
- [ ] A `role` field inside `publicMetadata`
- [ ] The role value set to `org:admin` or `org:member`
- [ ] No role stored in `.env`

## Important learning point

Step 1 is only the metadata layer. It creates the user’s identity label.

The next Step 2 will be:

- read `currentUser()` or `auth()` in a server file
- inspect `user.publicMetadata.role`
- allow or block access based on `org:admin` vs `org:member`

That is why Step 1 is the foundation:

- first assign the user a role
- then enforce the role in the app
