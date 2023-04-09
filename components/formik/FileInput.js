import TextError from "components/UI/TextError";
import React, { Fragment } from "react";

function FileInput({ label, name, className, errorMsg, onChange, ...rest }) {
  return (
    <Fragment>
      <div className={`${className}`}>
        <label htmlFor={label}>{label}</label>
        <input
          className="hidden"
          type="file"
          name={name}
          id={label}
          onChange={onChange}
          {...rest}
        />
        <TextError>{errorMsg}</TextError>
      </div>
    </Fragment>
  );
}

export default FileInput;
