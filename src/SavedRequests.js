import React from 'react';

const SavedRequests = ({ savedRequests, loadRequest }) => {
  return (
    <div className="saved-requests">
      <h3>Saved Requests</h3>
      {savedRequests.map((request, index) => (
        <button key={index} onClick={() => loadRequest(index)}>
          {request.name}
        </button>
      ))}
    </div>
  );
};

export default SavedRequests;