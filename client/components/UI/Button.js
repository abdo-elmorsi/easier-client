import React from "react";

const Button = ({ className, type, children, disabled, ...rest }) => {
  return (
    <button
      disabled={disabled}
      className={`${className} rounded-md bg-blue-700 py-2 px-4 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-700`}
      type={type || "button"}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
