import React from "react";

const Button = ({ children, className = "", onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-xl w-full cursor-pointer font-bold
        bg-gradient-to-r from-red-500 to-pink-500 text-white
        shadow-md
        transform transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-xl hover:from-pink-500 hover:to-red-500
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
