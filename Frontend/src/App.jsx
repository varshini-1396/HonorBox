import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Generate from "./components/Generate";
import BulkGenerate from "./components/BulkGenerate";
import Navbar from "./components/Navbar";
import Verify from "./components/Verify";
import NotFound from "./components/NotFound";
import DarkVeil from "./components/DarkVeil";
import About from './components/About';

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <DarkVeil />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/bulk-generate" element={<BulkGenerate />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/about" element={<About/>} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
