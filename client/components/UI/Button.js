import React from "react";

const Button = ({ className, type, children, ...rest }) => {
  return (
    <button
      className={`${className} bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md`}
      type={type || "button"}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
