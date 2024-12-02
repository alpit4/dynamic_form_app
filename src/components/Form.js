import React, { useState, useEffect } from "react";
import "./Form.css";

const Form = () => {
  const [formFields, setFormFields] = useState([]);
  const [formType, setFormType] = useState("User Information");
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [progress, setProgress] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const mockApiResponse = {
    "User Information": {
      fields: [
        {
          name: "firstName",
          type: "text",
          label: "First Name",
          required: true,
        },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        {
          name: "cardNumber",
          type: "text",
          label: "Card Number",
          required: true,
        },
        {
          name: "expiryDate",
          type: "date",
          label: "Expiry Date",
          required: true,
        },
        { name: "cvv", type: "password", label: "CVV", required: true },
        {
          name: "cardholderName",
          type: "text",
          label: "Cardholder Name",
          required: true,
        },
      ],
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = mockApiResponse[formType];
        if (response) {
          setFormFields(response.fields);
        } else {
          throw new Error("Invalid form type selected");
        }
      } catch (error) {
        console.error("Error fetching form data: ", error);
      }
    };

    fetchData();
  }, [formType]);

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
    setFormData({});
    setProgress(0);
    setEditingId(null);
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateProgress = () => {
    const totalFields = formFields.length;
    const filledFields = formFields.filter(
      (field) => formData[field.name] && formData[field.name] !== ""
    ).length;
    const progressPercent = Math.round((filledFields / totalFields) * 100);
    setProgress(progressPercent);
  };

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setSubmittedData((prevData) => ({
        ...prevData,
        [formType]: prevData[formType].map((data) =>
          data.id === editingId ? { ...data, ...formData } : data
        ),
      }));
      setEditingId(null);
    } else {
      setSubmittedData((prevData) => ({
        ...prevData,
        [formType]: [
          ...(prevData[formType] || []),
          { id: Date.now(), ...formData },
        ],
      }));
    }
    setFormData({});
    setProgress(0);
  };

  const handleEdit = (id) => {
    const entryToEdit = submittedData[formType].find((data) => data.id === id);
    setFormData(entryToEdit);
    setEditingId(id);
  };

  const handleDelete = (formType, id) => {
    setSubmittedData((prevData) => ({
      ...prevData,
      [formType]: prevData[formType].filter((data) => data.id !== id),
    }));
  };

  return (
    <div className="form-container">
      <select
        className="form-select"
        onChange={handleFormTypeChange}
        value={formType}
      >
        <option value="User Information">User Information</option>
        <option value="Address Information">Address Information</option>
        <option value="Payment Information">Payment Information</option>
      </select>

      <form className="form" onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div className="form-field" key={field.name}>
            <label>{field.label}</label>
            {field.type === "dropdown" ? (
              <select
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">Select...</option>
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
            )}
          </div>
        ))}
        <button className="form-submit" type="submit">
          {editingId ? "Update" : "Submit"}
        </button>
      </form>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{progress}% Completed</p>
      </div>

      {Object.keys(submittedData).map((form) => (
        <div key={form}>
          <h3 className="table-title">{form}</h3>
          {submittedData[form]?.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(submittedData[form][0])
                    .filter((key) => key !== "id")
                    .map((key) => (
                      <th key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </th>
                    ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submittedData[form].map((data) => (
                  <tr key={data.id}>
                    {Object.entries(data)
                      .filter(([key]) => key !== "id")
                      .map(([key, value]) => (
                        <td key={key}>{value}</td>
                      ))}
                    <td>
                      <button
                        className="action-button"
                        onClick={() => handleEdit(data.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleDelete(form, data.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default Form;
