const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");

// Route to generate a certificate
router.post("/generate", certificateController.generateCertificate);
// Route to generate multiple certificates in bulk
router.post("/bulk-generate", certificateController.bulkGenerateCertificates);
// Route to test email configuration
router.get("/test-email", certificateController.testEmail);
// Debug route to list all certificates
router.get("/list-all", certificateController.listAllCertificates);
router.get("/certificates",certificateController.getAllCertificates);
router.post("/send-certificate", certificateController.sendCertificate);
// Route to verify a certificate
router.get("/verify/:uniqueId", certificateController.verifyCertificate);
router.get("/certificate/:uniqueId", certificateController.verifyCertificateMAil);

module.exports = router;