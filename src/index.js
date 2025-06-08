import app from "./app.js";
import connectDB from "./db/db.connect.js";
import dotenv from "dotenv";
import authRoutes from "./routes/Auth.routes.js";
import contentRoutes from "./routes/Content.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/content", contentRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
