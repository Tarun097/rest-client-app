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
  sendRequest,
  saveRequest
}) => {
  return (
    <div className="request-container">
      <div className="form-group">
        <label>URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)} className="form-control">
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
        <button onClick={addHeaderField} className="form-control">Add Header</button>
      </div>
      <div className="form-group">
        <label>Request Body (JSON format)</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Request Body (JSON format)"
          className="form-control"
        />
      </div>
      <button onClick={sendRequest} className="send-btn">Send Request</button>
      <button onClick={saveRequest} className="save-btn">Save Request</button>
      <div className="form-group curl-section">
        <label>cURL Command</label>
        <textarea
          value={curlCommand}
          onChange={(e) => setCurlCommand(e.target.value)}
          placeholder="Paste cURL command here"
          className="form-control"
        />
        <button onClick={importCurl} className="import-btn">Import cURL</button>
      </div>
    </div>
  );
};

export default RequestForm;
