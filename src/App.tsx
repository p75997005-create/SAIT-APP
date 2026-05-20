import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { BankProvider } from "./context/BankContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TransferPage from "./pages/Transfer";
import Cards from "./pages/Cards";
import History from "./pages/History";
import Exchange from "./pages/Exchange";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BankProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="transfer" element={<TransferPage />} />
              <Route path="cards" element={<Cards />} />
              <Route path="history" element={<History />} />
              <Route path="exchange" element={<Exchange />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </BankProvider>
  );
}
