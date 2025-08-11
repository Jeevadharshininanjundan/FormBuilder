
import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="bg-[#116466] text-white px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-md border-b border-[#FF6F91]">
      <Link to="/" className="text-2xl font-extrabold text-white">
        FormBuilder
      </Link>

      
    
    </nav>
  );
};

export default Navbar;
