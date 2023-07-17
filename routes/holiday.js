const express = require("express");
const { newHoliday, getHoliday } = require("../controllers/holidayController");
const router = express.Router();

router.route("/holiday/new").post(newHoliday);
router.route("/holiday").get(getHoliday);

module.exports = router;
