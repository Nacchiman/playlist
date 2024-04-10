import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await prisma.users.findMany();
  res.json({ users });
});

export default app;
