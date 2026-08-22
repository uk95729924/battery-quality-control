import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
import ActionCard from "../components/ActionCard";
import InfoCard from "../components/InfoCard";
import RecentPredictions from "../components/RecentPredictions";

import {
  FaDatabase,
  FaBrain,
  FaMicroscope,
  FaChartLine,
  FaUpload,
  FaRobot,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* ================= Header ================= */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Electrode Quality Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back! Here's your system overview.
        </p>
      </div>

      {/* ================= Statistics Cards ================= */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Datasets"
          value="12"
          subtitle="Uploaded Datasets"
          icon={<FaDatabase className="text-blue-600" />}
        />

        <DashboardCard
          title="ML Models"
          value="4"
          subtitle="Random Forest, XGBoost, LightGBM, SVM"
          icon={<FaBrain className="text-green-600" />}
        />

        <DashboardCard
          title="Diagnosis"
          value="48"
          subtitle="Reports Generated"
          icon={<FaMicroscope className="text-orange-500" />}
        />

        <DashboardCard
          title="Prognosis"
          value="30"
          subtitle="Future Predictions"
          icon={<FaChartLine className="text-purple-600" />}
        />
      </div>

      {/* ================= Quick Actions ================= */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
          <ActionCard
            title="Upload Dataset"
            description="Upload Battery Electrode CSV/XLSX Dataset"
            icon={<FaUpload />}
            color="text-blue-600"
            onClick={() => navigate("/upload")}
          />

          <ActionCard
            title="Train Model"
            description="Train Random Forest, XGBoost and SVM Models"
            icon={<FaRobot />}
            color="text-green-600"
            onClick={() => navigate("/train")}
          />

          <ActionCard
            title="Quality Diagnosis"
            description="Predict Current Electrode Quality"
            icon={<FaMicroscope />}
            color="text-orange-500"
            onClick={() => navigate("/diagnosis")}
          />

          <ActionCard
            title="Quality Prognosis"
            description="Predict Future Electrode Quality"
            icon={<FaChartLine />}
            color="text-purple-600"
            onClick={() => navigate("/prognosis")}
          />
        </div>
      </div>

      {/* ================= Information Section ================= */}
      <div className="grid lg:grid-cols-2 gap-6 mt-12">
        <InfoCard
          title="Quality Diagnosis"
          description="Diagnosis identifies the current quality status of battery electrodes using Machine Learning models. The system classifies electrodes into Good, Medium, or Defective categories based on uploaded industrial datasets."
        />

        <InfoCard
          title="Quality Prognosis"
          description="Prognosis predicts future electrode quality trends using historical industrial datasets and Machine Learning algorithms. It estimates future quality, confidence level, and risk indicators for decision support."
        />
      </div>

      {/* ================= Recent Predictions ================= */}
      <RecentPredictions />
    </MainLayout>
  );
}

export default Dashboard;