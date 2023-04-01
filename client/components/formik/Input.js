import TextError from "components/UI/TextError";
import React, { Fragment } from "react";
import { Field, ErrorMessage } from "formik";

function Input({ label, name, type, className, ...rest }) {
  return (
    <Fragment>
      <Field name={name}>
        {({ field }) => {
          return (
            <div className={`${className} mb-4`}>
              {label && (
                <label htmlFor={label} className="block mb-2">
                  {label}
                </label>
              )}
              <input
                className="py-2 px-4 text-gray-800 w-full mb-1 bg-transparent border-2 border-gray-300 rounded focus:outline-none"
                type={type}
                {...rest}
                {...field}
              />
              <ErrorMessage component={TextError} name={name} />
            </div>
          );
        }}
      </Field>
    </Fragment>
  );
}

export default Input;
