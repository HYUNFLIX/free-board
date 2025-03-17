import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <div className="container text-center">
        <p className="mb-0">© {new Date().getFullYear()} Firebase 자유게시판</p>
      </div>
    </footer>
  );
}

export default Footer;