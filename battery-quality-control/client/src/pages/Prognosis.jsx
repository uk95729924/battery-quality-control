import { useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FaChartLine,
  FaBatteryFull,
  FaHeartbeat,
  FaShieldAlt,
  FaRobot,
  FaFlask,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

// =====================================================
// ELECTRODE PROGNOSIS
// =====================================================

function Prognosis() {
  // ===================================================
  // FORM DATA
  // ===================================================

  const [formData, setFormData] = useState({
    Electrode_Thickness: "",
    Coating_Weight: "",
    Coating_Uniformity: "",
    Slurry_Viscosity: "",
    Drying_Temperature: "",
    Drying_Time: "",
    Calender_Pressure: "",
    Roller_Speed: "",
    Electrode_Density: "",
    Moisture_Content: "",
    Surface_Roughness: "",
    Adhesion_Strength: "",
    Ambient_Humidity: "",
    Ambient_Temperature: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===================================================
  // INPUT FIELDS
  // ===================================================

  const fields = [
    "Electrode_Thickness",
    "Coating_Weight",
    "Coating_Uniformity",
    "Slurry_Viscosity",
    "Drying_Temperature",
    "Drying_Time",
    "Calender_Pressure",
    "Roller_Speed",
    "Electrode_Density",
    "Moisture_Content",
    "Surface_Roughness",
    "Adhesion_Strength",
    "Ambient_Humidity",
    "Ambient_Temperature",
  ];

  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===================================================
  // LOAD SAMPLE DATA
  // ===================================================

  const loadSampleData = () => {
    setFormData({
      Electrode_Thickness: 0.9,
      Coating_Weight: 52,
      Coating_Uniformity: 98,
      Slurry_Viscosity: 1800,
      Drying_Temperature: 85,
      Drying_Time: 20,
      Calender_Pressure: 120,
      Roller_Speed: 40,
      Electrode_Density: 3.2,
      Moisture_Content: 0.15,
      Surface_Roughness: 0.2,
      Adhesion_Strength: 9.5,
      Ambient_Humidity: 45,
      Ambient_Temperature: 25,
    });
  };

  // ===================================================
  // PREDICTION
  // ===================================================

  const handlePrediction = async () => {
    const emptyField = fields.find(
      (field) =>
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === undefined
    );

    if (emptyField) {
      alert(
        `Please enter ${emptyField.replaceAll("_", " ")}`
      );
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload = {};

      fields.forEach((field) => {
        payload[field] = Number(formData[field]);
      });

      const response = await axios.post(
        "http://127.0.0.1:5000/prognosis",
        payload
      );

      console.log(
        "PROGNOSIS RESPONSE:",
        response.data
      );

      setResult(response.data);
    } catch (error) {
      console.error(
        "PROGNOSIS ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Future quality prediction failed.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // RESULT VALUES
  // ===================================================

  const futureQuality =
    result?.future_quality ||
    result?.future_quality_label ||
    "Unknown";

  const predictionConfidence = Number(
    result?.future_quality_score ?? 0
  );

  const futureRisk =
    result?.future_risk ||
    "Unknown Risk";

  const riskLevel =
    result?.risk_level ||
    futureRisk;

  const degradationProbability = Number(
    result?.degradation_probability ?? 0
  );

  const model =
    result?.model ||
    "Unknown";

  const recommendation =
    result?.recommendation ||
    "No recommendation available.";

  const explanation =
    result?.explanation ||
    "The prognosis is generated using the trained machine-learning model and the supplied electrode manufacturing parameters.";

  const trend =
    result?.trend ||
    "No trend information available.";

  const prognosisNote =
    result?.prognosis_note ||
    result?.prognosisNote ||
    "";

  const predictionClass =
    result?.prediction_class ??
    "N/A";

  // ===================================================
  // BACKEND CALCULATED HEALTH
  // ===================================================
  //
  // IMPORTANT:
  // Health is now taken directly from backend.
  //
  // Example:
  // estimated_health: 26.69
  // health_status: Poor Health
  //
  // ===================================================

  const estimatedHealth = Number(
    result?.estimated_health ?? 0
  );

  const healthStatus =
    result?.health_status ||
    "Unknown Health";

  // ===================================================
  // BACKEND CALCULATED REMAINING LIFE
  // ===================================================

  const remainingCycles = Number(
    result?.remaining_life ?? 0
  );

  const lifeStatus =
    result?.life_status ||
    "Unknown Life Status";

  // ===================================================
  // PROBABILITIES
  // ===================================================

  const probabilities =
    result?.probabilities || {};

  const getProbability = (
    label,
    numericKey
  ) => {
    return Number(
      probabilities[label] ??
        probabilities[numericKey] ??
        0
    );
  };

  const goodProbability =
    getProbability("Good", "0");

  const majorDefectProbability =
    getProbability("Major_Defect", "1");

  const minorDefectProbability =
    getProbability("Minor_Defect", "2");

  // ===================================================
  // BACKEND PROJECTIONS
  // ===================================================

  const backendHealthProjection =
    Array.isArray(result?.health_projection)
      ? result.health_projection
      : [];

  const backendLifeProjection =
    Array.isArray(result?.life_projection)
      ? result.life_projection
      : [];

  const backendQualityProjection =
    Array.isArray(result?.quality_projection)
      ? result.quality_projection
      : [];

  // ===================================================
  // HEALTH PROJECTION DATA
  // ===================================================

  const healthProjection =
    backendHealthProjection.length > 0
      ? backendHealthProjection.map(
          (value, index) => ({
            label:
              index === 0
                ? "Current"
                : `Stage ${index}`,
            health: Number(value),
          })
        )
      : [
          {
            label: "Current",
            health: estimatedHealth,
          },
        ];

  // ===================================================
  // REMAINING LIFE PROJECTION DATA
  // ===================================================

  const lifeProjection =
    backendLifeProjection.length > 0
      ? backendLifeProjection.map(
          (value, index) => ({
            label:
              index === 0
                ? "Current"
                : `Stage ${index}`,
            cycle: Number(value),
          })
        )
      : [
          {
            label: "Current",
            cycle: remainingCycles,
          },
        ];

  // ===================================================
  // QUALITY PROJECTION DATA
  // ===================================================

  const qualityProjection =
    backendQualityProjection.length > 0
      ? backendQualityProjection.map(
          (value, index) => ({
            label:
              index === 0
                ? "Current"
                : `Stage ${index}`,
            score: Number(value),
          })
        )
      : [
          {
            label: "Current",
            score: predictionConfidence,
          },
        ];

  // ===================================================
  // PROBABILITY CHART DATA
  // ===================================================

  const probabilityData = [
    {
      className: "Good",
      probability: goodProbability,
    },
    {
      className: "Major Defect",
      probability: majorDefectProbability,
    },
    {
      className: "Minor Defect",
      probability: minorDefectProbability,
    },
  ];

  // ===================================================
  // CLASS PROFILE
  // ===================================================

  const getClassProfile = () => {
    const quality =
      futureQuality.toLowerCase();

    if (
      quality.includes("good") ||
      quality.includes("high")
    ) {
      return {
        status: "Good Quality",
        badge:
          "bg-green-100 text-green-700",
        text: "text-green-700",
        border: "border-green-200",
        bg: "bg-green-50",
        icon: <FaCheckCircle />,
      };
    }

    if (
      quality.includes("minor") ||
      quality.includes("medium")
    ) {
      return {
        status: "Minor Defect",
        badge:
          "bg-yellow-100 text-yellow-700",
        text: "text-yellow-700",
        border: "border-yellow-200",
        bg: "bg-yellow-50",
        icon: <FaExclamationTriangle />,
      };
    }

    return {
      status: "Major Defect",
      badge:
        "bg-red-100 text-red-700",
      text: "text-red-700",
      border: "border-red-200",
      bg: "bg-red-50",
      icon: <FaExclamationTriangle />,
    };
  };

  const classProfile =
    getClassProfile();

  // ===================================================
  // QUALITY STYLE
  // ===================================================

  const getQualityStyle = () => {
    const quality =
      futureQuality.toLowerCase();

    if (
      quality.includes("good") ||
      quality.includes("high")
    ) {
      return {
        box:
          "bg-green-50 border-green-200",
        text:
          "text-green-700",
        icon:
          <FaCheckCircle />,
      };
    }

    if (
      quality.includes("minor") ||
      quality.includes("medium")
    ) {
      return {
        box:
          "bg-yellow-50 border-yellow-200",
        text:
          "text-yellow-700",
        icon:
          <FaExclamationTriangle />,
      };
    }

    return {
      box:
        "bg-red-50 border-red-200",
      text:
        "text-red-700",
      icon:
        <FaExclamationTriangle />,
    };
  };

  const qualityStyle =
    getQualityStyle();

  // ===================================================
  // RISK STYLE
  // ===================================================

  const getRiskStyle = () => {
    const risk =
      futureRisk.toLowerCase();

    if (risk.includes("low")) {
      return "bg-green-100 text-green-700";
    }

    if (risk.includes("medium")) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  // ===================================================
  // HEALTH STYLE
  // ===================================================

  const getHealthStyle = () => {
    if (estimatedHealth >= 70) {
      return {
        box:
          "bg-green-50 border-green-200",
        text:
          "text-green-700",
      };
    }

    if (estimatedHealth >= 40) {
      return {
        box:
          "bg-yellow-50 border-yellow-200",
        text:
          "text-yellow-700",
      };
    }

    return {
      box:
        "bg-red-50 border-red-200",
      text:
        "text-red-700",
    };
  };

  const healthStyle =
    getHealthStyle();

  // ===================================================
  // LIFE STYLE
  // ===================================================

  const getLifeStyle = () => {
    if (remainingCycles >= 70) {
      return {
        box:
          "bg-green-50 border-green-200",
        text:
          "text-green-700",
      };
    }

    if (remainingCycles >= 30) {
      return {
        box:
          "bg-yellow-50 border-yellow-200",
        text:
          "text-yellow-700",
      };
    }

    return {
      box:
        "bg-red-50 border-red-200",
      text:
        "text-red-700",
    };
  };

  const lifeStyle =
    getLifeStyle();

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <MainLayout>

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <div className="flex items-center justify-between gap-6">

          <div>

            <h1 className="
              text-4xl
              font-bold
              text-slate-800
            ">
              Electrode Prognosis
            </h1>

            <p className="
              text-gray-500
              mt-2
            ">
              Predict future electrode quality
              and degradation risk using
              Machine Learning.
            </p>

          </div>

          <div className="
            bg-blue-600
            text-white
            rounded-xl
            px-6
            py-4
            shadow-lg
            text-right
          ">

            <p className="
              text-sm
              opacity-90
            ">
              Estimated Remaining Life
            </p>

            <h2 className="
              text-2xl
              font-bold
            ">
              {result
                ? `${remainingCycles} Cycles`
                : "Awaiting Prediction"}
            </h2>

          </div>

        </div>

      </div>

      {/* =================================================
          INPUT FORM
      ================================================= */}

      <div className="
        bg-white
        rounded-3xl
        shadow-xl
        border
        border-gray-200
        p-8
      ">

        <div className="mb-6">

          <h2 className="
            text-2xl
            font-bold
            text-slate-800
          ">
            Manufacturing Parameters
          </h2>

          <p className="
            text-gray-500
            text-sm
            mt-1
          ">
            Enter current electrode manufacturing
            parameters for future quality prognosis.
          </p>

        </div>

        <div className="
          grid
          md:grid-cols-2
          gap-6
        ">

          {fields.map((field) => (

            <div key={field}>

              <label className="
                block
                mb-2
                font-semibold
                text-sm
                text-slate-700
              ">
                {field.replaceAll("_", " ")}
              </label>

              <input
                type="number"
                step="any"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.replaceAll(
                  "_",
                  " "
                )}`}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  p-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                "
              />

            </div>

          ))}

        </div>

        {/* BUTTONS */}

        <div className="
          mt-10
          flex
          flex-wrap
          gap-5
        ">

          <button
            onClick={loadSampleData}
            className="
              flex
              items-center
              gap-3
              bg-green-600
              hover:bg-green-700
              text-white
              px-8
              py-4
              rounded-2xl
              shadow-lg
              transition-all
              duration-300
              hover:scale-105
            "
          >
            <FaFlask />
            Load Sample Data
          </button>

          <button
            onClick={handlePrediction}
            disabled={loading}
            className={`
              flex
              items-center
              gap-3
              text-white
              px-8
              py-4
              rounded-2xl
              shadow-lg
              transition-all
              duration-300

              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
              }
            `}
          >
            <FaRobot />

            {loading
              ? "Predicting..."
              : "Predict Future Quality"}
          </button>

        </div>

      </div>

      {/* =================================================
          RESULTS
      ================================================= */}

      {result && (

        <div className="mt-10">

          {/* =================================================
              RESULT CARDS
          ================================================= */}

          <div className="
            grid
            xl:grid-cols-6
            lg:grid-cols-3
            md:grid-cols-2
            gap-6
            mb-8
          ">

            {/* FUTURE QUALITY */}

            <div className={`
              border
              rounded-3xl
              shadow-md
              p-6
              ${qualityStyle.box}
            `}>

              <div className={`
                text-3xl
                ${qualityStyle.text}
              `}>
                {qualityStyle.icon}
              </div>

              <p className="
                mt-4
                text-gray-600
              ">
                Future Quality
              </p>

              <h2 className={`
                text-2xl
                font-bold
                mt-2
                ${qualityStyle.text}
              `}>
                {futureQuality}
              </h2>

            </div>

            {/* PREDICTION CONFIDENCE */}

            <div className="
              bg-indigo-50
              border
              border-indigo-200
              rounded-3xl
              shadow-md
              p-6
            ">

              <FaHeartbeat
                size={38}
                className="text-indigo-600"
              />

              <p className="
                mt-4
                text-gray-600
              ">
                Prediction Confidence
              </p>

              <h2 className="
                text-3xl
                font-bold
                text-indigo-700
                mt-2
              ">
                {predictionConfidence.toFixed(2)}%
              </h2>

              <p className="
                text-xs
                text-gray-500
                mt-2
              ">
                ML model confidence
              </p>

            </div>

            {/* ESTIMATED HEALTH */}

            <div className={`
              ${healthStyle.box}
              border
              rounded-3xl
              shadow-md
              p-6
            `}>

              <FaBatteryFull
                size={38}
                className={healthStyle.text}
              />

              <p className="
                mt-4
                text-gray-600
              ">
                Estimated Health
              </p>

              <h2 className={`
                text-3xl
                font-bold
                mt-2
                ${healthStyle.text}
              `}>
                {estimatedHealth.toFixed(2)}%
              </h2>

              <p className="
                text-xs
                text-gray-500
                mt-2
              ">
                {healthStatus}
              </p>

            </div>

            {/* REMAINING LIFE */}

            <div className={`
              ${lifeStyle.box}
              border
              rounded-3xl
              shadow-md
              p-6
            `}>

              <FaChartLine
                size={38}
                className={lifeStyle.text}
              />

              <p className="
                mt-4
                text-gray-600
              ">
                Remaining Life
              </p>

              <h2 className={`
                text-3xl
                font-bold
                mt-2
                ${lifeStyle.text}
              `}>
                {remainingCycles} Cycles
              </h2>

              <p className="
                text-xs
                text-gray-500
                mt-2
              ">
                {lifeStatus}
              </p>

            </div>

            {/* DEGRADATION TREND */}

            <div className="
              bg-amber-50
              border
              border-amber-200
              rounded-3xl
              shadow-md
              p-6
            ">

              <FaChartLine
                size={38}
                className="text-amber-600"
              />

              <p className="
                mt-4
                text-gray-600
              ">
                Degradation Trend
              </p>

              <h2 className="
                text-xl
                font-bold
                text-amber-700
                mt-2
              ">
                {trend}
              </h2>

              <p className="
                text-xs
                text-gray-500
                mt-2
              ">
                Model-derived trend
              </p>

            </div>

            {/* FUTURE RISK */}

            <div className="
              bg-violet-50
              border
              border-violet-200
              rounded-3xl
              shadow-md
              p-6
            ">

              <FaShieldAlt
                size={38}
                className="text-violet-600"
              />

              <p className="
                mt-4
                text-gray-600
              ">
                Future Risk
              </p>

              <div className="mt-3">

                <span className={`
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-semibold
                  ${getRiskStyle()}
                `}>
                  {futureRisk}
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              FUTURE QUALITY ASSESSMENT
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-8
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-slate-800
                ">
                  Future Quality Assessment
                </h2>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                ">
                  Machine-learning-based prognosis
                  of future electrode quality.
                </p>

              </div>

              <div className="
                bg-blue-50
                text-blue-700
                px-4
                py-2
                rounded-xl
                font-semibold
              ">
                {model}
              </div>

            </div>

            <div className="
              grid
              md:grid-cols-3
              gap-6
            ">

              <div className="
                border
                rounded-2xl
                p-5
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Prediction Class
                </p>

                <h3 className="
                  text-2xl
                  font-bold
                  text-slate-800
                  mt-2
                ">
                  {predictionClass}
                </h3>

              </div>

              <div className="
                border
                rounded-2xl
                p-5
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Risk Level
                </p>

                <h3 className={`
                  text-2xl
                  font-bold
                  mt-2
                  ${
                    riskLevel
                      .toLowerCase()
                      .includes("high")
                      ? "text-red-600"
                      : riskLevel
                          .toLowerCase()
                          .includes("medium")
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                `}>
                  {riskLevel}
                </h3>

              </div>

              <div className="
                border
                rounded-2xl
                p-5
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Model Used
                </p>

                <h3 className="
                  text-2xl
                  font-bold
                  text-blue-700
                  mt-2
                ">
                  {model}
                </h3>

              </div>

            </div>

          </div>

          {/* =================================================
              PREDICTION PROBABILITY
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-8
            mt-8
          ">

            <div className="mb-6">

              <h2 className="
                text-2xl
                font-bold
                text-slate-800
              ">
                Prediction Probability
              </h2>

              <p className="
                text-gray-500
                text-sm
                mt-1
              ">
                Probability distribution across
                electrode quality classes.
              </p>

            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={probabilityData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="className"
                />

                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) =>
                    `${value}%`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(2)}%`,
                    "Probability",
                  ]}
                />

                <Bar
                  dataKey="probability"
                  fill="#2563eb"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                  barSize={70}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* =================================================
              HEALTH + REMAINING LIFE
          ================================================= */}

          <div className="
            grid
            xl:grid-cols-2
            gap-8
            mt-8
          ">

            {/* HEALTH PROJECTION */}

            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              border
              border-gray-200
              p-8
            ">

              <div className="
                flex
                items-center
                justify-between
                mb-6
              ">

                <div>

                  <h2 className="
                    text-2xl
                    font-bold
                    text-slate-800
                  ">
                    Electrode Health Projection
                  </h2>

                  <p className="
                    text-gray-500
                    text-sm
                    mt-1
                  ">
                    Backend-generated health projection
                    across the estimated lifecycle.
                  </p>

                </div>

                <div className={`
                  px-4
                  py-2
                  rounded-xl
                  font-semibold
                  ${classProfile.badge}
                `}>
                  {healthStatus}
                </div>

              </div>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <LineChart
                  data={healthProjection}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="label"
                  />

                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(2)}%`,
                      "Estimated Health",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="health"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

            {/* REMAINING LIFE */}

            <div className="
              bg-white
              rounded-3xl
              shadow-xl
              border
              border-gray-200
              p-8
            ">

              <div className="mb-6">

                <h2 className="
                  text-2xl
                  font-bold
                  text-slate-800
                ">
                  Remaining Life Projection
                </h2>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                ">
                  Backend-generated remaining
                  production cycles.
                </p>

              </div>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={lifeProjection}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="label"
                  />

                  <YAxis
                    domain={[
                      0,
                      Math.max(
                        10,
                        ...lifeProjection.map(
                          (item) =>
                            item.cycle
                        )
                      ),
                    ]}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${Number(value)} cycles`,
                      "Remaining Life",
                    ]}
                  />

                  <Bar
                    dataKey="cycle"
                    fill="#10b981"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                    barSize={45}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* =================================================
              QUALITY PROJECTION
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-8
            mt-8
          ">

            <div className="mb-6">

              <h2 className="
                text-2xl
                font-bold
                text-slate-800
              ">
                Quality Projection
              </h2>

              <p className="
                text-gray-500
                text-sm
                mt-1
              ">
                Backend-generated quality projection
                across the estimated lifecycle.
              </p>

            </div>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={qualityProjection}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="label"
                />

                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) =>
                    `${value}%`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toFixed(2)}%`,
                    "Quality Score",
                  ]}
                />

                <Bar
                  dataKey="score"
                  fill="#2563eb"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                  barSize={55}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* =================================================
              DEGRADATION RISK
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-8
            mt-8
          ">

            <div className="
              flex
              justify-between
              items-center
              mb-4
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-slate-800
                ">
                  Degradation Risk
                </h2>

                <p className="
                  text-gray-500
                  text-sm
                  mt-1
                ">
                  Estimated probability of future
                  quality degradation.
                </p>

              </div>

              <span className="
                text-orange-600
                font-bold
                text-xl
              ">
                {degradationProbability.toFixed(2)}%
              </span>

            </div>

            <div className="
              w-full
              h-6
              bg-slate-200
              rounded-full
              overflow-hidden
            ">

              <div
                className="
                  h-6
                  bg-orange-500
                  rounded-full
                  transition-all
                  duration-700
                "
                style={{
                  width: `${Math.min(
                    degradationProbability,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

          {/* =================================================
              RECOMMENDATION
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-8
            mt-8
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-4
            ">

              <FaExclamationTriangle
                className="text-orange-500"
                size={24}
              />

              <h2 className="
                text-2xl
                font-bold
                text-slate-800
              ">
                Quality Recommendation
              </h2>

            </div>

            <div className="
              bg-blue-50
              border-l-4
              border-blue-600
              rounded-xl
              p-5
            ">

              <p className="
                text-slate-700
                leading-relaxed
              ">
                {recommendation}
              </p>

            </div>

          </div>

          {/* =================================================
              MODEL EXPLANATION
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-8
            mt-8
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-4
            ">

              <FaRobot
                className="text-blue-600"
                size={24}
              />

              <h2 className="
                text-2xl
                font-bold
                text-slate-800
              ">
                Model Explanation
              </h2>

            </div>

            <div className="
              bg-slate-50
              rounded-xl
              p-5
            ">

              <p className="
                text-gray-700
                leading-relaxed
              ">
                {explanation}
              </p>

              {prognosisNote && (
                <div className="
                  mt-4
                  bg-blue-50
                  border-l-4
                  border-blue-500
                  rounded-xl
                  p-4
                ">
                  <p className="
                    text-sm
                    text-slate-700
                    leading-relaxed
                  ">
                    <span className="font-semibold">
                      Prognosis Note:
                    </span>{" "}
                    {prognosisNote}
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* =================================================
              PROGNOSIS SUMMARY
          ================================================= */}

          <div className="
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-gray-200
            p-8
            mt-8
          ">

            <h2 className="
              text-2xl
              font-bold
              text-slate-800
              mb-6
            ">
              Prognosis Summary
            </h2>

            <div className="
              grid
              md:grid-cols-2
              lg:grid-cols-4
              gap-5
            ">

              {/* MODEL */}

              <div className="
                border
                rounded-2xl
                p-5
                bg-slate-50
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  ML Model
                </p>

                <p className="
                  text-xl
                  font-bold
                  text-blue-700
                  mt-2
                ">
                  {model}
                </p>

              </div>

              {/* FUTURE QUALITY */}

              <div className="
                border
                rounded-2xl
                p-5
                bg-slate-50
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Future Quality
                </p>

                <p className={`
                  text-xl
                  font-bold
                  mt-2
                  ${qualityStyle.text}
                `}>
                  {futureQuality}
                </p>

              </div>

              {/* CONFIDENCE */}

              <div className="
                border
                rounded-2xl
                p-5
                bg-slate-50
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Prediction Confidence
                </p>

                <p className="
                  text-xl
                  font-bold
                  text-indigo-700
                  mt-2
                ">
                  {predictionConfidence.toFixed(2)}%
                </p>

              </div>

              {/* DEGRADATION */}

              <div className="
                border
                rounded-2xl
                p-5
                bg-slate-50
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Degradation Probability
                </p>

                <p className="
                  text-xl
                  font-bold
                  text-orange-600
                  mt-2
                ">
                  {degradationProbability.toFixed(2)}%
                </p>

              </div>

              {/* TREND */}

              <div className="
                border
                rounded-2xl
                p-5
                bg-amber-50
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Degradation Trend
                </p>

                <p className="
                  text-lg
                  font-bold
                  text-amber-700
                  mt-2
                ">
                  {trend}
                </p>

              </div>

            </div>

            {/* HEALTH + LIFE */}

            <div className="
              grid
              md:grid-cols-2
              gap-5
              mt-5
            ">

              {/* ESTIMATED HEALTH */}

              <div className="
                border
                rounded-2xl
                p-5
                bg-sky-50
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Estimated Health
                </p>

                <p className="
                  text-xl
                  font-bold
                  text-sky-700
                  mt-2
                ">
                  {estimatedHealth.toFixed(2)}%
                </p>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">
                  {healthStatus}
                </p>

              </div>

              {/* REMAINING LIFE */}

              <div className="
                border
                rounded-2xl
                p-5
                bg-emerald-50
              ">

                <p className="
                  text-gray-500
                  text-sm
                ">
                  Remaining Life
                </p>

                <p className="
                  text-xl
                  font-bold
                  text-emerald-700
                  mt-2
                ">
                  {remainingCycles} Cycles
                </p>

                <p className="
                  text-sm
                  text-gray-500
                  mt-1
                ">
                  {lifeStatus}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </MainLayout>
  );
}

export default Prognosis;