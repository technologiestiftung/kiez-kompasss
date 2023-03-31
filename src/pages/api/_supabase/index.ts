import { createClient } from "@supabase/supabase-js";
import { Database } from "./Database";

if (
	!process.env.NEXT_PUBLIC_SUPABASE_API_URL ||
	!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
	throw new Error("Missing Supabase environment variables");
}
export const supabase = createClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_API_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
