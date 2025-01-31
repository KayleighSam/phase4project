import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <p>&copy; {new Date().getFullYear()} Real Estate App. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
