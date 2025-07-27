import { useState, useRef } from "react";
import DarkVeil from "./DarkVeil";

const BulkGenerate = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState(null);
  const [uploadedImage, setUploadedImage] = useState("");

  const fileInputRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  console.log('BACKEND_URL:', BACKEND_URL); // Debug log

  // Example CSV template
  const csvTemplate = `name,email,type
John Doe,john@example.com,Participation
Jane Smith,jane@example.com,Excellence
Mike Johnson,mike@example.com,Completion`;

  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackgroundImage(imageUrl);
    }
  };

  const parseCSV = (csvText) => {
    try {
      const lines = csvText.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate headers
      const requiredHeaders = ['name', 'email', 'type'];
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
      }
      
      const recipients = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length >= 3) {
            const recipient = {
              name: values[0],
              email: values[1],
              type: values[2]
            };
            recipients.push(recipient);
          }
        }
      }
      return recipients;
    } catch (error) {
      console.error('CSV parsing error:', error);
      throw error;
    }
  };

  const handleBulkGenerate = async () => {
    if (!csvFile) {
      setMessage("Please upload a CSV file first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResults(null);

    try {
      const csvText = await csvFile.text();
      console.log('CSV content:', csvText); // Debug log
      
      const recipients = parseCSV(csvText);
      console.log('Parsed recipients:', recipients); // Debug log

      // Validate recipients
      const validRecipients = recipients.filter(recipient => {
        return recipient.name && recipient.email && recipient.type;
      });

      console.log('Valid recipients:', validRecipients); // Debug log

      if (validRecipients.length === 0) {
        setMessage("No valid recipients found in CSV. Please check the format.");
        setLoading(false);
        return;
      }

      // Map certificate types
      const mappedRecipients = validRecipients.map(recipient => ({
        name: recipient.name,
        email: recipient.email,
        certificateType: recipient.type || "Participation"
      }));

      console.log('Mapped recipients:', mappedRecipients); // Debug log

      const requestBody = {
        recipients: mappedRecipients,
        backgroundImage: backgroundImage
      };

      console.log('Request body:', requestBody); // Debug log

      const response = await fetch(`${BACKEND_URL}/api/bulk-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
      
      console.log('Response:', data);
      
      if (response.ok) {
        setResults(data);
        setMessage(`Bulk generation completed! ${data.successful} successful, ${data.failed} failed.`);
      } else {
        setMessage(data.message || "Failed to generate certificates.");
      }
    } catch (error) {
      console.error('Bulk generation error:', error);
      setMessage(`Error processing CSV file: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSVTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'visible' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <DarkVeil />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }} className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-white drop-shadow-lg tracking-tight">
          Bulk Certificate Generation
        </h1>
        
        <div className="w-full max-w-2xl rounded-2xl bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-[rgba(180,120,255,0.18)] shadow-2xl p-8 flex flex-col gap-6">
          
          {/* CSV Upload Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white/90 mb-4">📄 Upload Recipients CSV</h2>
            
            <div className="flex flex-col gap-4">
              <label className="block text-lg font-semibold text-white/90">
                Upload CSV File:
              </label>
              <input
                type="file"
                accept=".csv"
                className="file-input file-input-bordered w-full bg-white/80"
                onChange={handleCsvUpload}
                ref={fileInputRef}
              />
              
              <div className="flex gap-2">
                <button
                  onClick={downloadCSVTemplate}
                  className="btn btn-outline btn-sm text-white border-white/30 hover:bg-white/20"
                >
                  📥 Download CSV Template
                </button>
                {csvFile && (
                  <span className="text-green-400 text-sm flex items-center">
                    ✅ {csvFile.name} uploaded
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Background Image Upload */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white/90 mb-4">🎨 Certificate Background (Optional)</h2>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full bg-white/80"
              onChange={handleBackgroundUpload}
            />
            {backgroundImage && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white/90 mb-2">Preview:</h3>
                <img src={backgroundImage} alt="Background" className="w-64 h-48 rounded-lg border shadow-md object-cover" />
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            className="mt-6 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xl font-extrabold font-[Inter] shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            onClick={handleBulkGenerate}
            disabled={loading || !csvFile}
          >
            {loading ? "🔄 Generating Certificates..." : "🚀 Generate Bulk Certificates"}
          </button>

          {/* Messages */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes("completed") || message.includes("successful") 
                ? "bg-green-500/20 border border-green-500/30" 
                : "bg-red-500/20 border border-red-500/30"
            }`}>
              <p className="text-center font-semibold">{message}</p>
            </div>
          )}

          {/* Results Display */}
          {results && (
            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-bold text-white/90">📊 Generation Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
                  <h4 className="font-bold text-green-400">✅ Successful</h4>
                  <p className="text-2xl font-bold text-white">{results.successful}</p>
                </div>
                <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
                  <h4 className="font-bold text-red-400">❌ Failed</h4>
                  <p className="text-2xl font-bold text-white">{results.failed}</p>
                </div>
                <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-bold text-blue-400">📊 Total</h4>
                  <p className="text-2xl font-bold text-white">{results.totalProcessed}</p>
                </div>
              </div>

              {/* Successful Results */}
              {results.results && results.results.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-green-400 mb-2">✅ Successful Certificates:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {results.results.map((result, index) => (
                      <div key={index} className="bg-green-500/10 p-2 rounded text-sm">
                        <span className="font-semibold">{result.name}</span> - {result.email} 
                        <br />
                        <span className="text-xs">
                          ID: {result.uniqueId} 
                          {result.emailStatus && (
                            <span className={`ml-2 ${
                              result.emailStatus === 'sent' ? 'text-green-600' : 
                              result.emailStatus === 'failed' ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                              (Email: {result.emailStatus}
                              {result.emailError && result.emailStatus === 'failed' && (
                                <span className="text-xs text-red-500"> - {result.emailError}</span>
                              )}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Results */}
              {results.errors && results.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold text-red-400 mb-2">❌ Failed Certificates:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {results.errors.map((error, index) => (
                      <div key={index} className="bg-red-500/10 p-2 rounded text-sm">
                        <span className="font-semibold">{error.name}</span> - {error.email} (Error: {error.error})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <h3 className="font-bold text-blue-400 mb-2">📋 Instructions:</h3>
            <ul className="text-sm text-white/80 space-y-1">
              <li>• Download the CSV template and fill in recipient details</li>
              <li>• Upload the filled CSV file</li>
              <li>• Optionally upload a background image for certificates</li>
              <li>• Click "Generate Bulk Certificates" to process</li>
              <li>• Certificates will be automatically emailed to recipients</li>
              <li>• Maximum 100 certificates per bulk operation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkGenerate; 