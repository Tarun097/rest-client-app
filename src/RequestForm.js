import React from 'react';
import HeaderField from './HeaderField';

const RequestForm = ({
  url,
  setUrl,
  method,
  setMethod,
  headers,
  handleHeaderChange,
  addHeaderField,
  removeHeaderField,
  body,
  setBody,
  curlCommand,
  setCurlCommand,
  importCurl,
  sendRequest
}) => {
  return (
    <div className="request-container">
      <h1>REST Client</h1>
      <div className="form-group">
        <label>URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
      </div>
      <div className="form-group">
        <label>Method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="form-group">
        <label>Headers</label>
        {headers.map((header, index) => (
          <HeaderField
            key={index}
            index={index}
            header={header}
            handleHeaderChange={handleHeaderChange}
            removeHeaderField={removeHeaderField}
          />
        ))}
        <button onClick={addHeaderField}>Add Header</button>
      </div>
      <div className="form-group">
        <label>Request Body (JSON format)</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Request Body (JSON format)"
        />
      </div>
      <button onClick={sendRequest} className="send-btn">Send Request</button>
      <div className="form-group curl-section">
        <label>cURL Command</label>
        <textarea
          value={curlCommand}
          onChange={(e) => setCurlCommand(e.target.value)}
          placeholder="Paste cURL command here"
        />
        <button onClick={importCurl} className="import-btn">Import cURL</button>
      </div>
    </div>
  );
};

export default RequestForm;
