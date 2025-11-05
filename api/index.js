// api/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import userRouter from "../Routes/UserRoutes/userRouter.js";
import adminRouter from "../Routes/AdminRoutes/adminRouter.js";
import stonesRouter from "../Routes/StonesRoutes/StonesRoutes.js";

dotenv.config({ path: "./config.env" });

const app = express();

/* ---------------- CORS must be FIRST ---------------- */
app.use(cors({
  origin: "*", // allow all for now; restrict later if needed
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.options("*", cors());

/* --------------- Body parsing ---------------- */
app.use(express.json());

/* --------------- DB connect (serverless cold start) --------------- */
connectDB().catch(e => console.error("DB connect error:", e));

/* --------------- Static (ephemeral on Vercel) --------------- */
app.use("/images", express.static("uploads"));

/* --------------- Routes --------------- */
app.use("/api/user", userRouter);
app.use("/api", adminRouter);
app.use("/api/stones", stonesRouter);

/* --------------- Health --------------- */
app.get("/", (_req, res) => res.status(200).send("✅ Server running successfully!"));

/* --------------- Global error handler (adds CORS on 500s) --------------- */
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })
    .json({ success: false, message: "Internal server error" });
});

export default app;

/* --------------- Local dev only --------------- */
if (!process.env.VERCEL) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Local API on ${port}`));
}
