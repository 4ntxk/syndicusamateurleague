// Auth disabled for now: provide safe stubs
export const auth = async () => null;
export const handlers = {
  GET: async () => new Response("Auth disabled", { status: 404 }),
  POST: async () => new Response("Auth disabled", { status: 404 }),
} as const;
export const signIn = async () => {
  throw new Error("Auth disabled");
};
export const signOut = async () => {
  throw new Error("Auth disabled");
};
