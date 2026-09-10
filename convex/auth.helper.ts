import { ActionCtx } from "./_generated/server";

export const authIdentity = async (ctx: ActionCtx) => {  // doesnt work bcs theres more than just actionctxs
  const identity = await ctx.auth.getUserIdentity(); 
  if (!identity) { 
    throw new Error("not authenticated"); 
  } 
  return identity;
};

// lol this is way too much work, not using this yet