import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FeedbackPage from "./pages/FeedbackPage";
import TTSPage from "./pages/TTSPage";
import STSPage from "./pages/STSPage";
import STTPage from "./pages/STTPage";
import Layout from "./components/Layout";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;