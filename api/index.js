import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import userRouter from "../Routes/UserRoutes/userRouter.js";
import adminRouter from "../Routes/AdminRoutes/adminRouter.js";
import stonesRouter from "../Routes/StonesRoutes/StonesRoutes.js";

dotenv.config({ path: "./config.env" });

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// ⚠️ Vercel is serverless; connect once at cold start
// Avoid top-level await; just call connect and ignore if already connected
connectDB().catch((e) => console.error("DB connect error:", e));

// Static (note: ephemeral on Vercel)
app.use("/images", express.static("uploads"));

// Routes
app.use("/api/user", userRouter);
app.use("/api", adminRouter);
app.use("/api/stones", stonesRouter);

// Health check
app.get("/", (req, res) => res.status(200).send("✅ Server running successfully!"));

// 👉 Export the Express app as default — Vercel uses it as the handler
export default app;

// Local dev only
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Local API on ${port}`));
}