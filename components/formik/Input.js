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
                <label htmlFor={label} className="mb-2 block text-gray-800 dark:text-white">
                  {label}
                </label>
              )}
              <input
                className="mb-1 w-full rounded border-2 border-gray-300 bg-transparent py-2 px-4 text-gray-800 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
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
