import React, { useState } from 'react';

const SavedRequests = ({ savedRequests, loadRequest }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleLoadRequest = (index) => {
    loadRequest(index);
    setSelectedRequest(index);
  };

  return (
    <div className="saved-requests">
      <h3>Saved Requests</h3>
      {savedRequests.map((request, index) => (
        <button
          key={index}
          onClick={() => handleLoadRequest(index)}
          className={`request-button ${selectedRequest === index ? 'selected' : ''}`}
        >
          {request.name}
        </button>
      ))}
    </div>
  );
};

export default SavedRequests;
