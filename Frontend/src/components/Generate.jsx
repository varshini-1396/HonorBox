/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import QRCode from "qrcode";

const Generate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [certificateType, setCertificateType] = useState("Participation");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const canvasRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleGenerate = async () => {
    setLoading(true);
    setMessage("");

    const certificateData = { name, email, certificateType };

    try {
      const response = await fetch(`${BACKEND_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certificateData),
      });

      const data = await response.json();

      if (response.ok) {
        setUniqueId(data.certificate.uniqueId);
        setMessage(`Certificate generated successfully! ID: ${data.certificate.uniqueId}`);

        const certLink = `${BACKEND_URL}/api/certificate/${data.certificate.uniqueId}`;
        
        // Generate QR Code
        QRCode.toDataURL(certLink, { width: 120 })
          .then((qrCodeUrl) => {
            setQrCodeUrl(qrCodeUrl);
            generateCanvasCertificate(qrCodeUrl, data.certificate.uniqueId);
          })
          .catch((err) => console.error("QR Code Generation Error:", err));

        // Open Modal
        document.getElementById("certificate-modal")?.showModal();
      } else {
        setMessage(data.message || "Failed to generate certificate.");
      }
    } catch (error) {
      setMessage("Error generating certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateCanvasCertificate = (qrUrl, certId) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Title
    ctx.fillStyle = "#000";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${certificateType} Certificate`, canvas.width / 2, 100);

    // Recipient Name
    ctx.font = "20px Arial";
    ctx.fillText("Awarded to:", canvas.width / 2, 200);
    
    ctx.font = "bold 24px Arial";
    ctx.fillText(name, canvas.width / 2, 250);

    // Email
    ctx.font = "16px Arial";
    ctx.fillText(email, canvas.width / 2, 300);

    // Footer
    ctx.font = "16px Arial";
    ctx.fillText("Congratulations on your achievement!", canvas.width / 2, 500);

    // Certificate ID
    ctx.font = "16px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.fillText(`ID: ${certId}`, 20, canvas.height - 20);

    // Draw QR Code
    if (qrUrl) {
      const qrImage = new Image();
      qrImage.crossOrigin = "anonymous";
      qrImage.src = qrUrl;
      qrImage.onload = () => {
        ctx.drawImage(qrImage, canvas.width - 140, canvas.height - 140, 100, 100);
      };
      qrImage.onerror = (err) => {
        console.error("QR Code Image Load Error:", err);
      };
    }
  };

  const handleSendCertificate = async () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");

    try {
      const response = await fetch(`${BACKEND_URL}/api/send-certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, image }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Certificate sent successfully!");
        setTimeout(() => {
          document.getElementById("certificate-modal")?.close();
        }, 1000);
        
        // Reset fields
        setName("");
        setEmail("");
        setCertificateType("Participation");
        setMessage("");
        setUniqueId("");
      } else {
        alert(data.message || "Failed to send certificate.");
      }
    } catch (error) {
      alert("Error sending certificate. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Generate Certificate</h1>

      <div className="card bg-white shadow-lg p-6 w-full max-w-md">
        <label className="block text-lg font-semibold mb-2">Name:</label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter recipient's name"
        />

        <label className="block text-lg font-semibold mt-4 mb-2">Email:</label>
        <input
          type="email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter recipient's email"
        />

        <label className="block text-lg font-semibold mt-4 mb-2">Certificate Type:</label>
        <select
          className="select select-bordered w-full"
          value={certificateType}
          onChange={(e) => setCertificateType(e.target.value)}
        >
          <option value="Participation">Participation</option>
          <option value="Completion">Completion</option>
          <option value="Excellence">Excellence</option>
          <option value="Achievement">Achievement</option>
        </select>

        <button className="btn btn-primary w-full mt-4" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Certificate"}
        </button>

        {message && <p className="text-green-600 mt-4">{message}</p>}
      </div>

      {/* Certificate Preview Modal */}
      <dialog id="certificate-modal" className="modal">
        <div className="modal-box">
          <h2 className="text-2xl font-bold text-center mb-4">Certificate Preview</h2>
          <canvas ref={canvasRef} className="w-full border"></canvas>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSendCertificate}>Send</button>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Generate;
