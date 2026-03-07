import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all users
export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query('users').collect();
	}
});

// Add a new user
export const add = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		const name = args.name.trim();
		if (!name) throw new Error('User name cannot be empty');
		return await ctx.db.insert('users', { name });
	}
});

// Delete a user
export const remove = mutation({
	args: { id: v.id('users') },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.id);
		if (!user) throw new Error('User not found');
		await ctx.db.delete(args.id);
	}
});