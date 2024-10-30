import React from 'react';
import './Dasbord.css'

const Footer = () => {
  return (
    <footer className=" row bg-clair mt-auto text-white py-2 ">
    
        <div className="row mt-1">
          <div className="col text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} DDS littoral. All Rights Reserved.</p>
          </div>
        </div>
    
    </footer>
  );
};

export default Footer;
