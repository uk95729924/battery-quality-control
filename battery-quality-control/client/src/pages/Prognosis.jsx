import { useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  FaChartLine,
  FaBatteryFull,
  FaHeartbeat,
  FaShieldAlt,
  FaRobot,
  FaFlask
} from "react-icons/fa";

function Prognosis() {

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
    Ambient_Temperature: ""

  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  const loadSampleData = () => {

    setFormData({

      Electrode_Thickness: 0.90,
      Coating_Weight: 52,
      Coating_Uniformity: 98,
      Slurry_Viscosity: 1800,
      Drying_Temperature: 85,
      Drying_Time: 20,
      Calender_Pressure: 120,
      Roller_Speed: 40,
      Electrode_Density: 3.20,
      Moisture_Content: 0.15,
      Surface_Roughness: 0.20,
      Adhesion_Strength: 9.50,
      Ambient_Humidity: 45,
      Ambient_Temperature: 25

    });

  };

  const handlePrediction = async () => {

    setLoading(true);

    try {

      const response = await axios.post(

        "http://127.0.0.1:5000/prognosis",

        formData

      );

      setResult(response.data);

    }

    catch (error) {

      console.log(error);

      alert("Future Prediction Failed");

    }

    setLoading(false);

  };

  const healthData = [

  { cycle: "Current", health: result?.future_quality_score || 98 },

  { cycle: "10", health: (result?.future_quality_score || 98) - 0.5 },

  { cycle: "20", health: (result?.future_quality_score || 98) - 1.2 },

  { cycle: "30", health: (result?.future_quality_score || 98) - 2 },

  { cycle: "40", health: (result?.future_quality_score || 98) - 3 },

  { cycle: "50", health: (result?.future_quality_score || 98) - 4 }

];

const qualityData = [

  {
    name: "Quality",
    value: result?.future_quality_score || 98
  },

  {
    name: "Degradation",
    value: result?.degradation_probability || 2
  }

];
const featureData = [

  { feature: "Coating Uniformity", importance: 95 },

  { feature: "Moisture Content", importance: 86 },

  { feature: "Electrode Density", importance: 79 },

  { feature: "Drying Temperature", importance: 70 },

  { feature: "Adhesion Strength", importance: 61 }

];

const COLORS = [

  "#2563eb",

  "#93c5fd"

];

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
    "Ambient_Temperature"

  ];

  return (

    <MainLayout>

     <div className="mb-8">

    <div className="flex items-center justify-between">

        <div>

            <h1 className="text-4xl font-bold text-slate-800">

                Electrode prognosis 

            </h1>

            <p className="text-gray-500 mt-2">

                Predict future electrode health using Artificial Intelligence and Machine Learning.

            </p>

        </div>

        <div className="bg-blue-600 text-white rounded-xl px-6 py-4 shadow-lg">

            <p className="text-sm">

                Prediction Horizon

            </p>

            <h2 className="text-2xl font-bold">

                30 Days

            </h2>

        </div>

    </div>

</div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">

        <div className="grid md:grid-cols-2 gap-6">

          {fields.map((field) => (

            <div key={field}>

              <label className="block mb-2 font-semibold">

                {field.replaceAll("_", " ")}

              </label>

              <input

                type="number"

                step="any"

                name={field}

                value={formData[field]}

                onChange={handleChange}

                className="w-full border rounded-lg p-3"

              />

            </div>

          ))}

        </div>

        <div className="mt-10 flex flex-wrap gap-5">

  <button
    onClick={loadSampleData}
    className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
  >

    <FaFlask />

    Load Sample Data

  </button>

  <button
    onClick={handlePrediction}
    disabled={loading}
    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
  >

    <FaRobot />

    {loading ? "Predicting..." : "Predict Future Quality"}

  </button>

</div>

      </div>
     
   {result && (





<div className="mt-10">

<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">

   <div className="bg-sky-50 border border-sky-200 rounded-3xl shadow-md p-6">

        <FaBatteryFull size={40}/>

        <p className="mt-4 opacity-80">

            Future Quality

        </p>

      <div className="mt-3">
  <span
    className={`px-4 py-2 rounded-full text-sm font-semibold ${
      result.future_quality === "Good Quality"
        ? "bg-green-100 text-green-700"
        : result.future_quality === "Medium Quality"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {result.future_quality}
  </span>
</div>

    </div>

  
<div className="bg-indigo-50 border border-indigo-200 rounded-3xl shadow-md p-6">

        <FaHeartbeat size={40}/>

        <p className="mt-4 opacity-80">

            Estimated Health

        </p>

        <h2 className="text-3xl font-bold">

            {result.future_quality_score}%

        </h2>

    </div>

    <div className="bg-emerald-50 border border-emerald-200 rounded-3xl shadow-md p-6">

        <FaChartLine size={40}/>

        <p className="mt-4 opacity-80">

            Remaining Life

        </p>

        <h2 className="text-3xl font-bold">

            {result.remaining_cycles}

        </h2>

    </div>

    <div className="bg-violet-50 border border-violet-200 rounded-3xl shadow-md p-6">

        <FaShieldAlt size={40}/>

        <p className="mt-4 opacity-80">

            Future Risk

        </p>

        <div className="mt-3">
  <span
    className={`px-4 py-2 rounded-full text-sm font-semibold ${
      result.future_risk === "Low Risk"
        ? "bg-green-100 text-green-700"
        : result.future_risk === "Medium Risk"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {result.future_risk}
  </span>
</div>

    </div>

</div>

<div className="bg-white rounded-3xl shadow-xl border p-8">
  <div className="grid lg:grid-cols-2 gap-6">
          

     <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5 mt-8">

    <h2 className="text-2xl font-bold text-slate-800 mb-6">

        Battery Health Trend

    </h2>

    <ResponsiveContainer width="100%" height={320}>

        <LineChart data={healthData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="cycle" />

            <YAxis domain={[90, 100]} />

            <Tooltip />

            <Line
                type="monotone"
                dataKey="health"
                stroke="#2563eb"
                strokeWidth={4}
            />

        </LineChart>

    </ResponsiveContainer>

</div>

<div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mt-8">

    <h2 className="text-2xl font-bold text-slate-800 mb-6">

        Quality Distribution
        

    </h2>

    <ResponsiveContainer width="100%" height={320}>

        <PieChart>

            <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
                label
            >

                {COLORS.map((color, index) => (

                    <Cell
                        key={index}
                        fill={color}
                    />

                ))}

            </Pie>

            <Tooltip />

        </PieChart>

    </ResponsiveContainer>

</div>
</div>

<div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mt-8">

    <h2 className="text-2xl font-bold text-slate-800 mb-6">

        Feature Importance

    </h2>

    <ResponsiveContainer width="100%" height={250}>

        <BarChart data={featureData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
                dataKey="feature"
                angle={-15}
                textAnchor="end"
                height={80}
            />

            <YAxis />

            <Tooltip />

           <Bar
    dataKey="importance"
    fill="#2563eb"
    radius={[8, 8, 0, 0]}
    barSize={35}
/>

        </BarChart>

    </ResponsiveContainer>

</div>

<div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mt-8">

    <div className="flex justify-between items-center mb-3">

        <h2 className="text-xl font-bold text-slate-800">

            Prediction Confidence

        </h2>

        <span className="text-blue-700 font-bold text-lg">

            {result.future_quality_score}%

        </span>

    </div>

    <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">

        <div

            className="h-5 bg-blue-600 rounded-full transition-all duration-700"

            style={{ width: `${result.future_quality_score}%` }}

        ></div>

    </div>

</div>

<div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mt-8">

    <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Overall Battery Status
    </h2>

    <div className="grid md:grid-cols-3 gap-6">

        <div className="border rounded-2xl p-5 bg-sky-50">

            <p className="text-gray-500">
                Battery Health
            </p>

            <h3 className="text-3xl font-bold text-blue-700">
                {result.future_quality_score}%
            </h3>

        </div>

        <div className="border rounded-2xl p-5 bg-green-50">

            <p className="text-gray-500">
                Remaining Life
            </p>

            <h3 className="text-3xl font-bold text-green-700">
                {result.remaining_cycles}
            </h3>

        </div>

        <div className="border rounded-2xl p-5 bg-yellow-50">

            <p className="text-gray-500">
                Risk Level
            </p>

            <h3 className="text-3xl font-bold text-yellow-700">
                {result.future_risk}
            </h3>

        </div>

    </div>

</div>

          <div className="border rounded-xl p-5 mt-6">

            <h3 className="font-bold mb-2">

             
              Recommendation

            </h3>

            <p>

              {result.recommendation}

            </p>

          </div>

          <div className="border rounded-xl p-5 mt-6">

            <h3 className="font-bold mb-2">

              Explanation

            </h3>

            <p>

              {result.explanation}

            </p>

          </div>
          

        </div>
        
    </div>  
      

      

      )}

    </MainLayout>

  );

}

export default Prognosis;