const router = require("express").Router();

const controller = require("../controllers/rfidController");

router.post("/scan", controller.receiveScan);
//router.get("/scan", controller.getScans);

module.exports = router;