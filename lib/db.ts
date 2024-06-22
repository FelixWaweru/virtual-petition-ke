import { createClient } from "@libsql/client";

const NODE_ENV = process.env.NODE_ENV || "development";

export const db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

export interface DatabaseUser {
    id: string;
    username: string;
    github_id: number;
    name?: string;
    email: string;
}
