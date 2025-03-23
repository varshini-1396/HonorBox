const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");

// Route to generate a certificate
router.post("/generate", certificateController.generateCertificate);
router.get("/certificates",certificateController.getAllCertificates); // New route to get all certificates
router.post("/send-certificate", certificateController.sendCertificate);
// Route to verify a certificate
router.get("/verify/:uniqueId", certificateController.verifyCertificate);
router.get("/certificate/:uniqueId", certificateController.verifyCertificateMAil);

module.exports = router;