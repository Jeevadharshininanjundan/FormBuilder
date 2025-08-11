/*import React, {useState} from 'react';
import axios from  'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Register() {
    const [form, setForm] = useState({firstname: '', lastname: '', email: '', password: ''});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form,[e.target.name]: e.target.value});
    }

    const HandleSubmit = async (e) =>{
        e.preventDefault();
        try{
            await axios.post('/register', form);
      toast.success('🟣 Registered successfully!', {
        position: 'top-center',
      });

      // Wait a bit to show the toast
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed', {
        position: 'top-center',
      });
    }
  };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0f] to-[#1c0f2e] px-4">
      <div className="bg-[#1f1f2e] text-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">📝 Register</h2>

        <form onSubmit={HandleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 transition py-2 rounded-lg text-white font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-purple-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
      
    );
}

export default Register;
*/
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/register', form);
      toast.success('🟣 Registered successfully!', {
        position: 'top-center',
      });

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D4F1F4] px-4">
      <div className="bg-[#116466] text-[#FFE8D6] rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center drop-shadow-sm">📝 Register</h2>

        <form onSubmit={HandleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#1B2B34] text-[#FFE8D6] rounded border border-[#FF6F91] focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#1B2B34] text-[#FFE8D6] rounded border border-[#FF6F91] focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#1B2B34] text-[#FFE8D6] rounded border border-[#FF6F91] focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#1B2B34] text-[#FFE8D6] rounded border border-[#FF6F91] focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
          />
          <button
            type="submit"
            className="w-full bg-[#FF6F91] hover:bg-[#e05c7e] transition py-2 rounded-lg text-[#116466] font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-[#FFE8D6] mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-[#FFE8D6] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
