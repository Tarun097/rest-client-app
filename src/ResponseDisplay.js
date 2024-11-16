import React from 'react';

const ResponseDisplay = ({ status, time, response, size }) => {
  return (
    <div className="response-container">
      {status && <div className={`response-code ${status.includes('Error') ? 'error' : ''}`}>Status: {status}</div>}
      {size && <div className="response-size">Size: {size} Bytes</div>}
      {time && <div className="response-time">Time: {time} ms</div>}
      <pre className="response">{response ? JSON.stringify(response, null, 2) : 'No Response'}</pre>
    </div>
  );
};

export default ResponseDisplay;