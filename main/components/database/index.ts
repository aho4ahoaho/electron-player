import { app } from "electron";
import { connectDatabase } from "./migrate";
import { PrismaClient } from "@prisma/client";

const isProd = process.env.NODE_ENV === "production";

const dbPath = isProd
    ? app.getPath("userData") + "/db.sqlite"
    : `${app.getPath("userData")} (development)` + "/db.sqlite";

connectDatabase(dbPath);

export const prisma = new PrismaClient({
    datasourceUrl: `file:${dbPath}`,
});
