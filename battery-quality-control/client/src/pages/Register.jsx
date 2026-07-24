import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = {
  name: formData.name,
  email: formData.email,
  password: formData.password,
};

localStorage.setItem("user", JSON.stringify(user));

    alert("Registration Successful");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex items-center justify-center px-6 py-10">

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl grid lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 text-white p-12 flex flex-col justify-center">

          <h2 className="text-3xl font-bold leading-snug">

            Intelligent Framework for Electrode Quality Control

          </h2>

          <p className="text-xl font-semibold text-blue-100 mt-2">

            Battery in Industry 4.0

          </p>

          <p className="mt-6 text-blue-100 leading-8">

            Register to access the intelligent battery electrode quality
            monitoring platform powered by Artificial Intelligence,
            Machine Learning and Industry 4.0 technologies.

          </p>

          <div className="mt-10 space-y-4">

            <div className="flex items-center gap-3">
              <span className="text-2xl">✔</span>
              <span>Secure User Registration</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">✔</span>
              <span>AI-Based Quality Monitoring</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">✔</span>
              <span>Machine Learning Prediction</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl">✔</span>
              <span>Industry 4.0 Dashboard</span>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-12 flex items-center">

          <div className="w-full">

            <h2 className="text-4xl font-bold text-slate-800 mb-2">

              Create Account

            </h2>

            <p className="text-gray-500 mb-8">

              Register to continue

            </p>

            <form onSubmit={handleRegister} className="space-y-5">

              {/* Full Name */}

              <div>

                <label className="font-semibold text-gray-700">

                  Full Name

                </label>

                <div className="flex items-center border rounded-xl mt-2 px-4 py-3">

                  <FaUser className="text-gray-400 mr-3" />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full outline-none"
                    value={formData.name}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label className="font-semibold text-gray-700">

                  Email Address

                </label>

                <div className="flex items-center border rounded-xl mt-2 px-4 py-3">

                  <FaEnvelope className="text-gray-400 mr-3" />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full outline-none"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label className="font-semibold text-gray-700">

                  Password

                </label>

                <div className="flex items-center border rounded-xl mt-2 px-4 py-3">

                  <FaLock className="text-gray-400 mr-3" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    className="w-full outline-none"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>

                </div>

              </div>

              {/* Confirm Password */}

              <div>

                <label className="font-semibold text-gray-700">

                  Confirm Password

                </label>

                <div className="flex items-center border rounded-xl mt-2 px-4 py-3">

                  <FaLock className="text-gray-400 mr-3" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="w-full outline-none"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

              </div>

              {/* Button */}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transition"
              >

                Register

              </button>

            </form>

            <p className="text-center mt-8 text-gray-600">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >

                Login

              </Link>
  

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;