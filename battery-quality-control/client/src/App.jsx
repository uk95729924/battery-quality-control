import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadDataset from "./pages/UploadDataset";
import TrainModel from "./pages/TrainModel";
import Diagnosis from "./pages/Diagnosis";
import Prognosis from "./pages/Prognosis";
import Preprocessing from "./pages/Preprocessing";
import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadDataset />
            </ProtectedRoute>
          }
        />

        <Route
          path="/preprocessing"
          element={
            <ProtectedRoute>
              <Preprocessing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/train"
          element={
            <ProtectedRoute>
              <TrainModel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/diagnosis"
          element={
            <ProtectedRoute>
              <Diagnosis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prognosis"
          element={
            <ProtectedRoute>
              <Prognosis />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Invalid Route */}

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;