// api/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import userRouter from "../Routes/UserRoutes/userRouter.js";
import adminRouter from "../Routes/AdminRoutes/adminRouter.js";
import stonesRouter from "../Routes/StonesRoutes/StonesRoutes.js";

// Load envs (Vercel uses dashboard vars; local can use config.env)
dotenv.config({ path: "./config.env" });

const app = express();

/* ----------------------------- CORS (first) ----------------------------- */
// Open CORS for all origins (good for testing/Postman). If you use cookies,
// change `origin` to your exact frontend URL and set credentials: true.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Handle preflight requests
app.options("*", cors());

/* --------------------------- Body parsing etc. --------------------------- */
app.use(express.json()); // you can add limits if needed

/* ----------------------------- DB connection ---------------------------- */
// Connect once per cold start on Vercel
connectDB().catch((e) => console.error("DB connect error:", e));

/* ------------------------------ Static files ---------------------------- */
// Note: Vercel FS is ephemeral. Use S3/Cloudinary for persistent uploads.
app.use("/images", express.static("uploads"));

/* --------------------------------- Routes -------------------------------- */
app.use("/api/user", userRouter);
app.use("/api", adminRouter);
app.use("/api/stones", stonesRouter);

/* ------------------------------- Health check ---------------------------- */
app.get("/", (_req, res) => res.status(200).send("✅ Server running successfully!"));

/* -------------------------- Export for Vercel ---------------------------- */
export default app;

/* ----------------------------- Local dev only ---------------------------- */
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Local API on ${port}`));
}
