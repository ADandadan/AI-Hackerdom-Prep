import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  announcements: defineTable({
    title: v.string(),
    body: v.string(),
    createdAt: v.number(),
    authorId: v.optional(v.string()),
  }).index("by_createdAt", ["createdAt"]),
});
