/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {useUser} from '../context/AuthContext.jsx';




const Login= ()=> {
    const [form, setForm] = useState({ email: '', password: '' });
    const {setUser,fetchUser} = useUser();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          
            const res = await axios.post('/login', form,{withCredentials: true});
            
            toast.success(' Login successful!', { position: 'top-center' });

            await fetchUser();
      // Delay to let the toast show
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed', {
        position: 'top-center',
      });
    }
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a0f] to-[#1c0f2e] px-4">
      <div className="bg-[#1f1f2e] text-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">🔐 Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 transition py-2 rounded-lg text-white font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Don't have an account? <a href="/register" className="text-purple-400 hover:underline">Register</a>
        </p>
      </div>
    </div>
      
    );
}
export default Login; 

*/
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/AuthContext.jsx';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setUser, fetchUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', form, { withCredentials: true });
      toast.success('Login successful!', { position: 'top-center' });
      await fetchUser();

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed', {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D4F1F4] px-4">
      <div className="bg-[#116466] text-[#FFE8D6] rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center drop-shadow-sm">🔐 Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-[#1B2B34] text-[#FFE8D6] rounded border border-[#FF6F91] focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-[#1B2B34] text-[#FFE8D6] rounded border border-[#FF6F91] focus:outline-none focus:ring-2 focus:ring-[#FF6F91]"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#FF6F91] hover:bg-[#e05c7e] transition py-2 rounded-lg text-[#116466] font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-[#FFE8D6] mt-4 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-[#FFE8D6] hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
