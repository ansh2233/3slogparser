import React, { useState } from "react";
import "./KeyValueInput.css";

const KeyValueInput = ({ index, defaultDict, onHeaderChange, type }) => {
  const [key, setKey] = useState(Object.keys(defaultDict)[0]);
  const [value, setValue] = useState(Object.values(defaultDict)[0]);
  const [visible, setVisible] = useState(true);

  const handleKVChange = (event) => {
    setKey(event.target.placeholder === "Key" ? event.target.value : key);
    setValue(event.target.placeholder === "Value" ? event.target.value : value);
    if (event.target.placeholder === "Key") {
        onHeaderChange(index, event.target.value, value, type);
    } else {
        onHeaderChange(index, key, event.target.value, type);
    }
  };

  const handleDelete = () => {
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="key-value-input">
      <div className="input-box">
        <input
          type="text"
          value={key}
          onChange={handleKVChange}
          placeholder="Key"
        />
      </div>
      <div className="input-box">
        <input
          type="text"
          value={value}
          onChange={handleKVChange}
          placeholder="Value"
        />
      </div>
      <button className="delete-button" onClick={handleDelete}>
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default KeyValueInput;