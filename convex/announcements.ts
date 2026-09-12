import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// "Previous announcement" — Home page and Admin page both read from this.
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("announcements")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();
  },
});

// "Add announcement" mutation from the Admin page.
export const create = mutation({
  args: {
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const title = args.title.trim();
    const body = args.body.trim();
    if (!title || !body) {
      throw new Error("Title and body are required");
    }

    return await ctx.db.insert("announcements", {
      title,
      body,
      createdAt: Date.now(),
      authorId: identity.subject,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("announcements") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    await ctx.db.delete(args.id);
  },
});
