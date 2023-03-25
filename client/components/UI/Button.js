import React from "react";

const Button = ({ className, children }) => {
  return (
    <button
      className={`${className} bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md`}
    >
      {children}
    </button>
  );
};

export default Button;
