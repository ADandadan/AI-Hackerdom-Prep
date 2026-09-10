import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { authIdentity } from "./auth.helper";

type Announcement = { // use schemas later
        id: string;
        title: string;
        body: string;
        createdAt: number;
};

export const queryAnnouncements = mutation({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").take(50);
    return messages.reverse();
  },
});

export const addAnnouncement = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    body: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); 
    if (!identity) { 
        throw new Error("not authenticated"); 
    } 

    await ctx.db.insert("messages", {
        id: v.string(),
        title: v.string(),
        body: v.string(),
        createdAt: v.number(),
    });
  },
});