const express = require("express");
const router = express.Router();

const { testEmail } = require("../controllers/emailController");

router.post("/test-email", testEmail);

module.exports = router;