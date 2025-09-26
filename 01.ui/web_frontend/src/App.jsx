import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import FeedbackPage from "./pages/FeedbackPage";
import TTSPage from "./pages/TTSPage";
import STSPage from "./pages/STSPage";
import STTPage from "./pages/STTPage";
import Layout from "./components/Layout";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { SpeakerProvider } from "./context/SpeakerContext";
import Demo from "./pages/Demo";
import "./index.css";
import ConsentPopUp from "./components/ConsentPopUp";

// ScrollToTop Component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <SpeakerProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/tts" element={<TTSPage />} />
            <Route path="/sts" element={<STSPage />} />
            <Route path="/stt" element={<STTPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<Demo />} />
          </Route>
        </Routes>
        <ConsentPopUp />
      </Router>
    </SpeakerProvider>
  );
}

export default App;