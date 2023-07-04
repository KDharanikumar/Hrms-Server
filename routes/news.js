const express = require("express");
const { getNews, newNews, getSingleNews, updateNews, deleteNews } = require("../controllers/newsController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");

router.route("/news").get(getNews);
// router.route("/news/new").post(isAuthenticatedUser, authorizeRoles("admin"), newNews);
router.route("/news/:id").get(getSingleNews);
router.route("/news/:id").put(updateNews);
router.route("/news/:id").delete(deleteNews);

// Admin Route
router.route("/admin/news/new").post(isAuthenticatedUser, authorizeRoles("admin"), newNews);

module.exports = router;
