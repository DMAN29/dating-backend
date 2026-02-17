// import express from "express";
// import authRoutes from "../modules/auth/auth.routes.js";
// import userRoutes, { adminUserRouter } from "../modules/user/user.routes.js";
// import swipeRoutes from "../modules/swipe/swipe.routes.js";
// import matchRoutes from "../modules/match/match.routes.js";
// import discoverRoutes from "../modules/discover/discover.routes.js";

// const router = express.Router();

// router.use("/auth", authRoutes);

// router.use("/user", userRoutes);

// router.use("/admin/users", adminUserRouter);

// router.use("/user/swipes", swipeRoutes);

// router.use("/user/matches", matchRoutes);

// router.use("/user/discover", discoverRoutes);

// export default router;

import express from "express";
import publicRoutes from "./public.routes.js";
import userRoutes from "./user.routes.js";
import adminRoutes from "./admin.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";

const router = express.Router();

// Route grouping
router.use("/auth", authRoutes);
router.use("/public", publicRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);

export default router;
