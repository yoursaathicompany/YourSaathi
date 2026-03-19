import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(url, secret, {
    db: { schema: "next_auth" },
    global: { headers: { "X-Client-Info": "@auth/supabase-adapter" } },
    auth: { persistSession: false },
});

async function test() {
    console.log("Testing Supabase Adapter connection to next_auth.accounts...");
    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .limit(1);
    
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Success:", data);
    }
}

test();
