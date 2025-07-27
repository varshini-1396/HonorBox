const Certificate = require("../models/Certificate");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const Joi = require("joi");


const certificateSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  certificateType: Joi.string().valid("Participation", "Completion", "Excellence", "Achievement").required(),
});


// Function to generate a unique 7-letter alphanumeric ID
const generateUniqueId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueId = "";
  for (let i = 0; i < 7; i++) {
    uniqueId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return uniqueId;
};

// Generate Certificate
exports.generateCertificate = async (req, res) => {
  try {
    const { name, email, certificateType } = req.body;
    const { error } = certificateSchema.validate({ name, email, certificateType });
    if (error) return res.status(400).json({ message: error.details[0].message });

    let uniqueId;
    let existingCertificate;
    do {
      uniqueId = generateUniqueId();
      existingCertificate = await Certificate.findOne({ uniqueId });
    } while (existingCertificate);

    // Generate QR Code linking to the verification page
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${uniqueId}`;
    const qrCodeUrl = await QRCode.toDataURL(verificationUrl);

    // Save to database
    const certificate = new Certificate({ name, email, certificateType, uniqueId, qrCodeUrl });
    await certificate.save();

    res.status(201).json({ message: "Certificate generated", uniqueId, qrCodeUrl, certificate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📧 Send Certificate API
exports.sendCertificate = async (req, res) => {
  const { email, image } = req.body;
  
  if (!email || !image) return res.status(400).json({ message: "Email and image are required" });

  try {
    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email Options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Certificate",
      html: "<p>Congratulations! Here is your certificate.</p>",
      attachments: [
        {
          filename: "certificate.png",
          content: image.split(";base64,").pop(),
          encoding: "base64",
        },
      ],
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    res.json({ message: "Certificate sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending certificate", error });
  }
};

// Verify Certificate
exports.verifyCertificate = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    console.log('Verifying certificate with ID:', uniqueId);
    
    const certificate = await Certificate.findOne({ uniqueId });
    console.log('Found certificate:', certificate);

    if (!certificate) {
      console.log('Certificate not found for ID:', uniqueId);
      return res.status(404).json({ message: "Certificate not found" });
    }

    console.log('Certificate verified successfully:', certificate.name);
    res.json(certificate);
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.verifyCertificateMAil = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const certificate = await Certificate.findOne({ uniqueId });

    if (!certificate) {
      return res.status(404).send("<h2 style='color:red;'>❌ Invalid Certificate</h2>");
    }

    res.send(`
      <html>
        <head>
          <title>Certificate Verification</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
            h2 { color: green; }
            p { font-size: 18px; }
          </style>
        </head>
        <body>
          <h2>✅ Certificate Verified</h2>
          <p><strong>Name:</strong> ${certificate.name}</p>
          <p><strong>Email:</strong> ${certificate.email}</p>
          <p><strong>Unique ID:</strong> ${certificate.uniqueId}</p>
          <p>Your certificate is valid! 🎉</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).send("<h2 style='color:red;'>❌ Server Error</h2>");
  }
};

// Bulk Certificate Generation Schema
const bulkCertificateSchema = Joi.object({
  recipients: Joi.array().items(
    Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      certificateType: Joi.string().valid("Participation", "Completion", "Excellence", "Achievement").required(),
    })
  ).min(1).max(100).required(), // Limit to 100 certificates per bulk operation
});

// Function to generate certificate image (simplified version without canvas)
const generateCertificateImage = async (name, certificateType, uniqueId, qrCodeUrl, backgroundImage = null) => {
  // For now, we'll return the QR code URL as the certificate image
  // In a production environment, you might want to use a service like Puppeteer or a cloud-based image generation service
  return qrCodeUrl;
};

// Function to send certificate email
const sendCertificateEmail = async (email, name, certificateType, uniqueId) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials not configured');
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add these options for better compatibility
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection configuration
    await transporter.verify();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Certificate - HonorBox",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #004aad;">🎉 Congratulations, ${name}!</h2>
          <p>Your certificate has been generated successfully.</p>
          <p><strong>Certificate Type:</strong> ${certificateType}</p>
          <p><strong>Unique ID:</strong> ${uniqueId}</p>
          <p>You can verify your certificate by visiting our verification page.</p>
          <p>Best regards,<br>HonorBox Team</p>
        </div>
      `,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email to ${email}: ${error.message}`);
  }
};

// Bulk Generate Certificates
exports.bulkGenerateCertificates = async (req, res) => {
  try {
    console.log('Bulk generation request received:', req.body);
    
    const { recipients, backgroundImage } = req.body;
    
    if (!recipients || !Array.isArray(recipients)) {
      return res.status(400).json({ message: "Recipients array is required" });
    }
    
    // Validate input
    const { error } = bulkCertificateSchema.validate({ recipients });
    if (error) {
      console.error('Validation error:', error);
      return res.status(400).json({ message: error.details[0].message });
    }

    console.log(`Processing ${recipients.length} recipients`);

    const results = [];
    const errors = [];

    // Process each recipient
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      console.log(`Processing recipient ${i + 1}/${recipients.length}:`, recipient.name);
      
      try {
        // Generate unique ID
        let uniqueId;
        let existingCertificate;
        do {
          uniqueId = generateUniqueId();
          existingCertificate = await Certificate.findOne({ uniqueId });
        } while (existingCertificate);

        // Generate QR Code
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${uniqueId}`;
        const qrCodeUrl = await QRCode.toDataURL(verificationUrl);

        // Save to database
        const certificate = new Certificate({
          name: recipient.name,
          email: recipient.email,
          certificateType: recipient.certificateType,
          uniqueId,
          qrCodeUrl
        });
        await certificate.save();
        console.log(`💾 Certificate saved to database: ${recipient.name} (ID: ${uniqueId})`);

        // Send email (optional - will continue even if email fails)
        let emailStatus = 'not_sent';
        try {
          await sendCertificateEmail(recipient.email, recipient.name, recipient.certificateType, uniqueId);
          console.log(`📧 Email sent to: ${recipient.email}`);
          emailStatus = 'sent';
        } catch (emailError) {
          console.warn(`⚠️ Email failed for ${recipient.email}:`, emailError.message);
          // Continue with certificate generation even if email fails
          emailStatus = 'failed';
        }

        results.push({
          name: recipient.name,
          email: recipient.email,
          uniqueId,
          status: 'success',
          emailStatus: emailStatus
        });

        console.log(`✅ Successfully processed: ${recipient.name}`);

      } catch (error) {
        console.error(`❌ Error processing ${recipient.name}:`, error);
        
        // Only count as error if it's not an email issue
        if (error.message.includes('Failed to send email')) {
          // Email failed but certificate was created successfully
          results.push({
            name: recipient.name,
            email: recipient.email,
            uniqueId: 'generated_but_email_failed',
            status: 'success',
            emailStatus: 'failed',
            note: 'Certificate created but email failed'
          });
        } else {
          // Real error - certificate generation failed
          errors.push({
            name: recipient.name,
            email: recipient.email,
            error: error.message
          });
        }
      }
    }

    const response = {
      message: `Bulk generation completed. ${results.length} successful, ${errors.length} failed.`,
      results,
      errors,
      totalProcessed: recipients.length,
      successful: results.length,
      failed: errors.length
    };

    console.log('Bulk generation response:', response);
    res.status(200).json(response);

  } catch (error) {
    console.error('Bulk generation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Test email configuration
exports.testEmail = async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ 
        message: "Email credentials not configured",
        error: "Please set EMAIL_USER and EMAIL_PASS in your .env file"
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await transporter.verify();
    
    // Send test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself as test
      subject: "HonorBox Email Test",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>✅ Email Test Successful!</h2>
          <p>Your HonorBox email configuration is working correctly.</p>
          <p>You can now use bulk certificate generation with email delivery.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    res.json({ 
      message: "Email test successful! Check your inbox.",
      emailUser: process.env.EMAIL_USER 
    });
    
  } catch (error) {
    console.error('Email test error:', error);
    res.status(500).json({ 
      message: "Email test failed",
      error: error.message,
      emailUser: process.env.EMAIL_USER
    });
  }
};

// Debug: List all certificates
exports.listAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().select('name email uniqueId certificateType issuedAt');
    console.log('All certificates in database:', certificates);
    res.json({
      count: certificates.length,
      certificates: certificates
    });
  } catch (error) {
    console.error('Error listing certificates:', error);
    res.status(500).json({ error: error.message });
  }
};

