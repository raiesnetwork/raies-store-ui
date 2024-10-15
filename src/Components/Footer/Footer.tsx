// StoreFooter.tsx
import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';

const StoreFooter: React.FC = () => {
  return (
    <footer className="store_footer">
      <div className="store_footer__links">
        <Link  to="/refund-cancellation-policy" className="store_footer__link">Refund and Cancellation Policy</Link>
        {/* <Link  to="/privacy-policy" className="store_footer__link">Privacy Policy</Link>
        <Link  to="/about-us" className="store_footer__link">About Us</Link>
        <Link  to="/contact-us" className="store_footer__link">Contact Us</Link>
        */}
        </div> 
      <div className="store_footer__copyright">
        &copy; {new Date().getFullYear()}  AIANR TECHNOLOGIES PRIVATE LIMITED. All Rights Reserved.
      </div>
    </footer>
  );
}

export default StoreFooter;
