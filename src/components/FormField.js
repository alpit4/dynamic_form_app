import React from "react";

const FormField = ({ field, value, onChange, error }) => {
  const { name, type, label, options, required } = field;

  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
        >
          <option value="">Select...</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          required={required}
        />
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FormField;
