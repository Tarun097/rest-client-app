import React from 'react';

const HeaderField = ({ header, index, handleHeaderChange, removeHeaderField }) => {
  return (
    <div key={index} className="header-field">
      <input
        type="text"
        value={header.key}
        onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
        placeholder="Header Key"
      />
      <input
        type="text"
        value={header.value}
        onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
        placeholder="Header Value"
      />
      <button onClick={() => removeHeaderField(index)}>-</button>
    </div>
  );
};

export default HeaderField;