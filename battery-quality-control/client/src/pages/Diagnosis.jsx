import { useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

function Diagnosis() {

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




  const handleDiagnosis = async () => {

    setLoading(true);

    try {

      const response = await axios.post(

        "http://127.0.0.1:5000/diagnosis",

        formData

      );

      setResult(response.data);

    } catch (error) {

      alert("Diagnosis Failed");

      console.log(error);

    }

    setLoading(false);

  };

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

        <h1 className="text-4xl font-bold">

          Electrode Quality Diagnosis

        </h1>

        <p className="text-gray-500 mt-2">

          Enter electrode manufacturing parameters to predict quality.

        </p>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">

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

        <div className="mt-8 flex gap-4">

  <button
    onClick={loadSampleData}
    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
  >
    Load Sample Data
  </button>

  <button
    onClick={handleDiagnosis}
    disabled={loading}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
  >
    {loading ? "Predicting..." : "Predict Quality"}
  </button>

</div>

      </div>

      {result && (

        <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

          <h2 className="text-2xl font-bold mb-6">

            Electrode Quality Assessment

          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="border rounded-xl p-5">

              <p className="text-gray-500">

                Quality

              </p>

              <h3 className="text-2xl font-bold text-green-600">

                {result.quality}

              </h3>

            </div>

            <div className="border rounded-xl p-5">

              <p className="text-gray-500">

                Quality Score

              </p>

              <h3 className="text-2xl font-bold">

                {result.quality_score} %

              </h3>

            </div>

            <div className="border rounded-xl p-5">

              <p className="text-gray-500">

                Risk Level

              </p>

              <h3 className="text-2xl font-bold">

                {result.risk}

              </h3>

            </div>

            <div className="border rounded-xl p-5">

              <p className="text-gray-500">

                Model Used

              </p>

              <h3 className="text-2xl font-bold">

                {result.model}

              </h3>

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

      )}

    </MainLayout>

  );

}

export default Diagnosis;



