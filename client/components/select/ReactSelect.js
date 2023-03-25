import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

function ReactSelect({
  className,
  onSelectChange,
  options,
  isSearchable,
  placeholder,
  defaultValue,
  label,
  error,
  errorMsg,
  isMulti,
  isDisabled,
  formatOptionLabel,
}) {
  const [selectedInput, setSelectedInput] = useState(defaultValue);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    onSelectChange(isMulti ? selectedInput : selectedInput?.value);
  }, [selectedInput?.value, selectedInput, isMulti]);

  const light = (isSelected, isFocused) => {
    return isSelected ? "#1d4ed8" : isFocused ? "#3b82f6" : undefined;
  };
  const dark = (isSelected, isFocused) => {
    return isSelected ? "#1d4ed8" : isFocused ? "#3b82f6" : "#151824";
  };

  const colorStyles = {
    control: (styles, { isDisabled }) => {
      return {
        ...styles,
        backgroundColor:
          theme === "dark" ? "#222738" : isDisabled ? "#e9ecef" : "#FFFFFF",
        borderColor: theme === "dark" ? "#374151" : "#eee",
        boxShadow: "none",
        "&:hover": {
          ...styles["&:hover"],
          borderColor: theme === "dark" ? "#374151" : "#eee",
        },
        ...(isDisabled
          ? {
              pointerEvents: "auto",
              cursor: "not-allowed",
            }
          : {
              pointerEvents: "auto",
              cursor: "pointer",
            }),
      };
    },
    option: (styles, { isDisabled, isSelected, isFocused }) => {
      return {
        ...styles,
        cursor: isDisabled ? "not-allowed" : "pointer",
        backgroundColor:
          theme === "dark"
            ? dark(isSelected, isFocused)
            : light(isSelected, isFocused),
        color: isSelected ? "#fff" : isFocused ? "#fff" : "inhert",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled
            ? isSelected
              ? "#1d4ed8"
              : "#3b82f6"
            : undefined,
        },
      };
    },
    singleValue: (styles) => {
      return { ...styles, color: theme === "dark" ? "#fff" : "inhert" };
    },
    menu: (styles) => {
      return {
        ...styles,
        backgroundColor: theme === "dark" ? "#151824" : "#fff",
        color: theme === "dark" ? "#fff" : "#151824",
      };
    },
    input: (styles) => {
      return { ...styles, color: theme === "dark" ? "#fff" : "#151824" };
    },
  };

  return (
    <>
      <div className="sm:col-span-3">
        {label && (
          <label
            htmlFor="select-client"
            className="block text-sm font-medium leading-6 text-gray-900 mb"
          >
            {label}
          </label>
        )}
        <div className="">
          <Select
            defaultValue={selectedInput}
            onChange={setSelectedInput}
            placeholder={placeholder}
            inputId="select-client"
            isSearchable={isSearchable}
            options={options}
            isMulti={isMulti}
            isDisabled={isDisabled}
            styles={colorStyles}
            formatOptionLabel={formatOptionLabel}
          />
        </div>
      </div>
      {error && (
        <span style={{ fontSize: "12px" }} className="text-red-500 mt-2">
          {errorMsg}
        </span>
      )}
    </>
  );
}

export default ReactSelect;
