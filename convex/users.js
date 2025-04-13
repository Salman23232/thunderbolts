import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const userController = mutation({
    args: {
      name: v.string(),
      email: v.string(),
      picture: v.string(),
      uid: v.string() // ✅ no `id` field here
    },
    handler: async (ctx, args) => {
      const users = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .collect();
  
      if (users.length === 0) {
        const result = await ctx.db.insert("users", {
          name: args.name,
          picture: args.picture,
          email: args.email,
          uid: args.uid,
        });
        console.log(result);
      }
    },
  });
  
export const getController = query({
    args:{
        email: v.string(),
    },
    handler:async (ctx, args) => {
        // if existing user
        const users = await ctx.db.query('users').filter((q)=> q.eq(q.field('email'), args.email)).collect()
        console.log(users[0]);
        return users[0]
    }
})

// export const UpdateToken = mutation({
//   args:{
//     token:v.number(),
//     userId:v.id('users')
//   },
//   handler:async(ctx, args) =>{
//     const result = await ctx.db.patch(args.userId, {
//       token:args.token
//     })
//     return result
//   }
// })
