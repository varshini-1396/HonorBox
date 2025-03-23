import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-9xl font-bold">HonorBox</h1>
            <p className="py-6 text-lg">
              A free & open-source web app for generating and verifying certificates instantly.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/generate" className="btn btn-primary">Generate Certificate</Link>
              <Link to="/verify" className="btn btn-secondary">Verify Certificate</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 px-6">
        <h2 className="text-4xl font-semibold text-center mb-6">Why Choose HonorBox?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card shadow-lg p-6 bg-white">
            <h3 className="text-xl font-bold">🔏 Secure Verification</h3>
            <p className="text-gray-600">Easily verify certificates with a unique verification code.</p>
          </div>
          <div className="card shadow-lg p-6 bg-white">
            <h3 className="text-xl font-bold">🎨 Customizable</h3>
            <p className="text-gray-600">Generate beautifully designed certificates for any event.</p>
          </div>
          <div className="card shadow-lg p-6 bg-white">
            <h3 className="text-xl font-bold">📜 Open Source</h3>
            <p className="text-gray-600">Free to use and customize as per your needs.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer p-4 bg-base-300 text-center">
        <p>© 2025 HonorBox. Built with ❤️ by Open Source Contributors.</p>
      </footer>
    </div>
  );
};

export default Home;
