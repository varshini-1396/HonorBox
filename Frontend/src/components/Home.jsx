import { Link } from "react-router-dom";
import { FaFileAlt, FaCertificate, FaShieldAlt, FaMagic, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const fontUrl = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap";

const features = [
  {
    icon: <FaShieldAlt className="text-violet-600 text-3xl mb-2" />,
    title: "Secure & Private",
    desc: "All certificates are cryptographically signed and verifiable. Your data stays private.",
  },
  {
    icon: <FaMagic className="text-blue-600 text-3xl mb-2" />,
    title: "Instant Generation",
    desc: "Create and share certificates in seconds with a beautiful, intuitive UI.",
  },
  {
    icon: <FaCertificate className="text-pink-500 text-3xl mb-2" />,
    title: "Open Source",
    desc: "MIT licensed, fully open, and free to use. Contribute or self-host easily.",
  },
];

const Home = () => {
  const user = localStorage.getItem("user");
  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'visible' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.section
          className="flex flex-col items-center justify-center min-h-[80vh] pt-32 pb-16 px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-white text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 drop-shadow-lg text-center"
            style={{ letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            HonorBox
          </motion.h1>
          <motion.p
            className="text-white/90 text-lg sm:text-2xl font-medium mb-8 text-center max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Build trust with instant verifiable certificates.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          >
            {/*check here */}
            {user ? (
              <Link
                to="/generate"
                className="px-7 py-3 rounded-full bg-white text-black text-lg font-medium font-[Inter] shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                tabIndex={0}
              >
                <FaFileAlt className="text-2xl" /> Generate Certificate
              </Link>
            ) : (
              <button
                onClick={() => alert("Please log in to generate certificates.")}
                className="px-7 py-3 rounded-full bg-white text-black text-lg font-medium font-[Inter] shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                tabIndex={0}
              >
                <FaFileAlt className="text-2xl" /> Generate Certificate
              </button>
            )}

            <Link
              to="/verify"
              className="px-7 py-3 rounded-full bg-gray-950 border border-gray-600 text-white text-lg font-medium font-[Inter] shadow-lg transition-transform hover:scale-105 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-300 flex items-center gap-2"
              tabIndex={0}
            >
              <FaFileAlt className="text-2xl" /> Verify Certificate
            </Link>

          </motion.div>
        </motion.section>

        <motion.section
          id="features"
          className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            Why Choose HonorBox?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-white/90 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.1 * i, ease: "easeOut" }}
                tabIndex={0}
              >
                {f.icon}
                <h3 className="text-xl font-bold mb-2 text-gray-900">{f.title}</h3>
                <p className="text-gray-600 text-base">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.footer
          className="w-full flex flex-col items-center justify-center mt-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-[rgba(180,120,255,0.18)] shadow-[0_4px_32px_0_rgba(80,80,180,0.10)] px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <span className="text-white text-lg font-bold tracking-tight">HonorBox</span>
              <span className="hidden md:inline text-white/70">|</span>
              <a href="#about" className="footer-link text-white/90 hover:text-blue-400 transition">About</a>
              <a href="#terms" className="footer-link text-white/90 hover:text-blue-400 transition">Terms</a>
              <a href="https://github.com/RamakrushnaBiswal/HonorBox" target="_blank" rel="noopener noreferrer" className="footer-link flex items-center gap-1 text-white/90 hover:text-pink-400 transition"><FaGithub className="text-xl" /> GitHub</a>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-xs font-semibold text-white">Open Source <FaCertificate className="text-pink-500" /></span>
              <span className="text-xs text-white/60">© {new Date().getFullYear()} HonorBox. Made by Ram</span>
            </div>
          </div>
          <style>{`
            .footer-link {
              text-decoration: none;
              position: relative;
              transition: color 0.2s;
            }
            .footer-link:after {
              content: '';
              position: absolute;
              left: 0; right: 0; bottom: -2px;
              height: 2px;
              background: linear-gradient(90deg, #7c3aed, #f472b6);
              border-radius: 2px;
              transform: scaleX(0);
              transition: transform 0.2s;
            }
            .footer-link:hover:after, .footer-link:focus:after {
              transform: scaleX(1);
            }
          `}</style>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;