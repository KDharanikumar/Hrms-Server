const express = require("express");
const { newHoliday, getHolidays, updateHoliday, deleteHoliday } = require("../controllers/holidayController");
const router = express.Router();

router.route("/holiday/new").post(newHoliday);
router.route("/holidays").get(getHolidays);
router.route("/holiday/:id").put(updateHoliday);
router.route("/holiday/:id").delete(deleteHoliday);

module.exports = router;
