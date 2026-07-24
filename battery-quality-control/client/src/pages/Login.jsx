import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleLogin = (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter Email and Password");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No user found. Please register first.");
    return;
  }

  if (email === user.email && password === user.password) {

  localStorage.setItem("isLoggedIn", "true");

  alert("Login Successful");

  navigate("/dashboard");

} else {

    alert("Invalid Email or Password");

  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex items-center justify-center px-6 py-10">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-6xl grid lg:grid-cols-2">

      {/* LEFT SIDE */}
<div className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 text-white p-12 flex flex-col justify-center">

  <h2 className="text-3xl font-bold leading-snug">
    Intelligent Framework for Electrode Quality Control  Battery in Industry 4.0
  </h2>

  <p className="mt-6 text-blue-100 leading-8">
    An AI-powered intelligent framework designed for monitoring,
    diagnosis and future quality prediction of battery electrodes
    using Machine Learning algorithms and Industry 4.0 technologies.
  </p>

  <div className="mt-10 space-y-4">

    <div className="flex items-center gap-3">
      <span className="text-2xl">✔</span>
      <span>Quality Diagnosis</span>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-2xl">✔</span>
      <span>Future Quality Prognosis</span>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-2xl">✔</span>
      <span>Machine Learning Prediction</span>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-2xl">✔</span>
      <span>Real-Time Industry Dashboard</span>
    </div>

  </div>

</div>

        {/* RIGHT SIDE */}
        <div className="p-12 flex items-center">

          <div className="w-full">

            <h2 className="text-4xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h2>

            <p className="text-gray-500 mb-10">
              Login to continue
            </p>

            <form onSubmit={handleLogin} className="space-y-6">

              {/* Email */}

              <div>

                <label className="font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="flex items-center border rounded-xl mt-2 px-4 py-3">

                  <FaEnvelope className="text-gray-400 mr-3" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="Enter your password"
                    className="w-full outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </button>

                </div>

              </div>

              {/* Remember */}

              <div className="flex justify-between items-center">

                <label className="flex items-center gap-2 text-gray-600">

                  <input type="checkbox" />

                  Remember Me

                </label>

                <Link
                  to="/"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* Button */}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
              >
                Login
              </button>

            </form>

            <p className="text-center mt-8 text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold"
              >
                Register
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;