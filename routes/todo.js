const express = require("express");
const { gettodo, newTodo, getSingleTodo, updateTodo, deleteTodo } = require("../controllers/todoController");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");

router.route("/todo").get(gettodo);
// router.route("/news/new").post(isAuthenticatedUser, authorizeRoles("admin"), newNews);
router.route("/todo/:id").get(getSingleTodo);
router.route("/todo/:id").put(updateTodo);
router.route("/todo/:id").delete(deleteTodo);

// Admin Route
router.route("/admin/todo/new").post(isAuthenticatedUser, authorizeRoles("admin"), newTodo);

module.exports = router;
