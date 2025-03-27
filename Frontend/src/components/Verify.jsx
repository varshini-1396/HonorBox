/* eslint-disable no-unused-vars */
import { useState } from "react";

const Verify = () => {
  const [certificateId, setCertificateId] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleVerify = async () => {
    setError("");
    setCertificateData(null);
    setLoading(true);

    if (!certificateId.trim()) {
      setError("Please enter a certificate ID.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/verify/${certificateId}`
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setCertificateData(data);
      } else {
        setError(data.message || "Certificate not found.");
      }
    } catch (err) {
      setError("Error verifying the  Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-primary">
        Verify Certificate
      </h1>

      <div className="card bg-white shadow-xl p-6 w-full max-w-lg rounded-lg">
        <label className="block text-lg font-semibold mb-2">
          Enter Certificate ID:
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
        />
        <button
          className="btn btn-primary w-full mt-4"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

        {certificateData && (
          <div className="mt-6 p-4 bg-amber-500 border-l-4 border-green-500 rounded-lg">
            <h2 className="text-xl font-semibold text-green-700">
              Certificate Verified ✅
            </h2>
            <p>
              <strong>Name:</strong> {certificateData.name}
            </p>
            <p>
              <strong>Email:</strong> {certificateData.email}
            </p>
            <p>
              <strong>Certificate Type:</strong>{" "}
              {certificateData.certificateType
                ? certificateData.certificateType
                : "N/A"}
            </p>
            <p>
              <strong>Unique ID:</strong> {certificateData.uniqueId}
            </p>
            <p>
              <strong>Date Issued:</strong>{" "}
              {certificateData.issuedAt
                ? new Date(certificateData.issuedAt).toLocaleDateString()
                : "N/A"}
            </p>

            {/* Display QR Code if available */}
            {certificateData.qrCodeUrl && (
              <div className="mt-4 text-center">
                <p>
                  <strong>Scan QR Code:</strong>
                </p>
                <a
                  href={certificateData.qrCodeUrl}
                  download="certificate_qr.png"
                >
                  <img
                    src={certificateData.qrCodeUrl}
                    alt="QR Code"
                    className="w-32 h-32 mx-auto border p-2 rounded-lg shadow-md cursor-pointer hover:opacity-80"
                  />
                </a>
                <p className="text-sm mt-2">Click QR to download</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
