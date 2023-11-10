import React, { useState, useEffect } from "react";

function Input({
  fontSize,
  width,
  height,
  placeholder,
  alignment,
  initialValue,
  color,
  type,
  focus,
  bg,
  tableFocus,
  addLeftPadding,
  restrict,
  addrightPadding,
  invoiceKey,
  onChange,
  onChangeFinal,
  useFinalOnChange,
  required,
  onChangeForDownload,
}) {
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;

    setInputValue(newValue);

    if (useFinalOnChange && onChangeFinal) {
      onChangeFinal(newValue);
    } else if (onChange) {
      onChange(newValue);
    }

    if (type === "textarea") {
      autoExpandTextarea(e.target);
    }
  };

  const autoExpandTextarea = (element) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const storedInvoice = JSON.parse(localStorage.getItem("Invoice")) || {};

  const [inputValue, setInputValue] = useState(
    storedInvoice[invoiceKey] || initialValue
  );

  useEffect(() => {
    const updatedInvoice = {
      ...storedInvoice,
      [invoiceKey]: inputValue,
    };
    localStorage.setItem("Invoice", JSON.stringify(updatedInvoice));
  }, [inputValue, invoiceKey, storedInvoice]);

  const isRequired =
    placeholder &&
    typeof placeholder === "string" &&
    placeholder.includes("(required)");

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            className={`p-3 ${
              isRequired ? "custom-focus-outline-req" : "custom-focus-outline"
            } ${
              focus
                ? "outline outline-gray-200"
                : "focus:outline-none outline-1 focus:outline-gray-200"
            }  rounded outline-2`}
            style={{
              color: color,
              width: width,
              height: "auto",
              minHeight: height,
              textAlign: alignment,
            }}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
          />
        );
      case "date":
        return (
          <input
            type="date"
            className={`p-3 custom-focus-outline ${
              focus
                ? "outline outline-gray-200"
                : "focus:outline-none outline-1 focus:outline-gray-200"
            }  rounded outline-2`}
            style={{
              color: color,
              width: width,
              height: height,
              textAlign: alignment,
            }}
            value={inputValue}
            onChange={handleInputChange}
          />
        );
      default:
        return (
          <input
            type={type}
            className={` ${
              required
                ? inputValue === ""
                  ? "custom-focus-outline-req-item"
                  : "custom-focus-outline"
                : ""
            } ${addrightPadding ? "pr-10" : ""} ${
              addLeftPadding ? "md:pl-12 pl-7 py-3 pr-3" : "p-3"
            } ${bg ? "custom-navbar-bg" : ""}  rounded outline-2 ${alignment} ${
              restrict
                ? "outline outline-none focus:outline-none outline-0 pointer-events-none cursor-not-allowed"
                : `${
                    tableFocus
                      ? "outline outline-none outline-0 focus:bg-gray-600"
                      : `${
                          focus
                            ? "outline outline-gray-200"
                            : "focus:outline-none outline-1 focus:outline-gray-200"
                        }`
                  }`
            }
            `}
            style={{
              color: color,
              width: width,
              height: height,
            }}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className="my-3" style={{ fontSize, width, color }}>
      {renderInput()}
    </div>
  );
}

export default Input;
