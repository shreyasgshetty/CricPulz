import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", photo: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("✅ Registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input type="text" placeholder="Photo URL" className="w-full p-3 border rounded-lg"
            onChange={(e) => setForm({ ...form, photo: e.target.value })} />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
