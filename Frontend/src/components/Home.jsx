import { Link } from "react-router-dom";

const Home = () => {
  const user = localStorage.getItem("user");

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 sm:px-6 lg:px-10">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-bold">HonorBox</h1>
            <p className="py-6 text-base sm:text-lg">
              A free & open-source web app for generating and verifying certificates instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link to="/generate" className="btn btn-primary w-full sm:w-auto">
                  Generate Certificate
                </Link>
              ) : (
                <button
                  className="btn btn-primary w-full sm:w-auto"
                  onClick={() => alert("Please log in to generate certificates.")}
                >
                  Generate Certificate
                </button>
              )}
              <Link to="/verify" className="btn btn-secondary w-full sm:w-auto">
                Verify Certificate
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-6">
          Why Choose HonorBox?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="card shadow-lg p-6 bg-white rounded-lg">
            <h3 className="text-lg md:text-xl font-bold">🔏 Secure Verification</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Easily verify certificates with a unique verification code.
            </p>
          </div>
          <div className="card shadow-lg p-6 bg-white rounded-lg">
            <h3 className="text-lg md:text-xl font-bold">🎨 Customizable</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Generate beautifully designed certificates for any event.
            </p>
          </div>
          <div className="card shadow-lg p-6 bg-white rounded-lg">
            <h3 className="text-lg md:text-xl font-bold">📜 Open Source</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Free to use and customize as per your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer p-4 bg-base-300 text-center text-sm sm:text-base">
        <p>© 2025 HonorBox. Made by Ram</p>
      </footer>
    </div>
  );
};

export default Home;