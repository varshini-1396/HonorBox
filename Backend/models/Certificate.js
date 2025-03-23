const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  certificateType: { type: String, required: true }, // Make sure the field name matches in API
  uniqueId: { type: String, required: true, unique: true },
  qrCodeUrl: { type: String, required: true }, // Use qrCodeUrl instead of qrCode
  issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Certificate", certificateSchema);
