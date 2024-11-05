import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [time, setTime] = useState('');

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeaderField = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeaderField = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    try {
      const headersObject = headers.reduce((acc, header) => {
        if (header.key) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {});

      let parsedBody;
      try {
        parsedBody = body ? JSON.parse(body) : undefined;
      } catch (error) {
        parsedBody = body; // Allow non-JSON bodies
      }

      const config = {
        method,
        url,
        headers: headersObject,
        data: parsedBody,
      };

      const startTime = Date.now();
      const res = await axios(config);
      const endTime = Date.now();

      setResponse(res.data);
      setStatus(res.status.toString());
      setTime(endTime - startTime);
    } catch (error) {
      setResponse(error.response ? error.response.data : error.message);
      setStatus(error.response ? error.response.status.toString() : 'Network Error');
      setTime('');
    }
  };

  return (
    <div className="app-container">
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
      </div>
      <div className="response-container">
        {status && <div className={`response-code ${status.includes('Error') ? 'error' : ''}`}>Status Code: {status}</div>}
        {time && <div className="response-time">Time: {time} ms</div>}
        <pre className="response">{response ? JSON.stringify(response, null, 2) : 'No Response'}</pre>
      </div>
    </div>
  );
}

export default App;
