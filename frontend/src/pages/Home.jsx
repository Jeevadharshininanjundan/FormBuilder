
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#D4F1F4] text-[#1B2B34] pt-24 flex items-center justify-center px-6">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center md:items-start gap-12">
        
        
        <div className="flex-1 flex flex-col justify-center items-start">
          <h1 className="text-6xl font-extrabold mb-6 text-[#116466] drop-shadow-sm">
            Welcome to Form Builder
          </h1>
          <p className="text-lg mb-10 max-w-xl">
            Create custom forms easily and collect responses seamlessly.
          </p>
         
            <Link
              to="/forms"
              className="px-8 py-3 bg-[#FFE8D6] text-[#116466] font-semibold rounded-lg shadow hover:bg-[#f5dec9] transition"
            >
              Create Form
            </Link>
         
        </div>

        
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
            alt="Form Builder Illustration"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>

      </div>
    </div>
  );
};

export default Home;


