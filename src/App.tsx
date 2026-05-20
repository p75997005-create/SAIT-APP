import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { ExamProvider } from "./context/ExamContext";
import { useExam } from "./context/useExam";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Exam from "./pages/Exam";
import Results from "./pages/Results";
import Review from "./pages/Review";
import Annulled from "./pages/Annulled";

function Routed() {
  const { state, hydrated } = useExam();

  if (!hydrated) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-sm uppercase tracking-widest opacity-70">
          Загрузка…
        </p>
      </div>
    );
  }

  // Annulled is sticky: no matter where the user goes, they only see this.
  if (state.status === "annulled") {
    return (
      <Routes>
        <Route path="*" element={<Annulled />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/results" element={<Results />} />
      <Route path="/review" element={<Review />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ExamProvider>
      <HashRouter>
        <Routed />
      </HashRouter>
    </ExamProvider>
  );
}
