import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import RequestForm from './RequestForm';
import ResponseDisplay from './ResponseDisplay';
import SavedRequests from './SavedRequests';

function App() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [time, setTime] = useState('');
  const [size, setSize] = useState('');
  const [curlCommand, setCurlCommand] = useState('');
  const [savedRequests, setSavedRequests] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState('User'); // Replace with actual username

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

      // Calculate response size
      const size = new TextEncoder().encode(JSON.stringify(res.data)).length;
      setSize(size);
    } catch (error) {
      setResponse(error.response ? error.response.data : error.message);
      setStatus(error.response ? error.response.status.toString() : 'Network Error');
      setTime('');
      setSize('');
    }
  };

  const saveRequest = () => {
    const maxLength = 30;
    let formattedUrl = url.replace(/^https?:\/\//, '');
    if (formattedUrl.length > maxLength) {
      formattedUrl = formattedUrl.substring(0, maxLength) + '...';
    }
    const requestName = `${method}_${formattedUrl}`;
    const newRequest = {
      name: requestName,
      url,
      method,
      headers,
      body,
    };
    setSavedRequests([...savedRequests, newRequest]);
  };

  const loadRequest = (index) => {
    const request = savedRequests[index];
    setUrl(request.url);
    setMethod(request.method);
    setHeaders(request.headers);
    setBody(request.body);
  };

  const importCurl = () => {
    const lines = curlCommand.split('\\\n').map(line => line.trim());
    let newMethod = 'GET';
    let newUrl = '';
    let newHeaders = [];
    let newBody = '';
    let isData = false;

    lines.forEach(line => {
      if (line.includes('-X') || line.includes('--request')) {
        const methodParts = line.split(' ');
        if (methodParts.length > 1) {
          newMethod = methodParts[methodParts.indexOf('-X') + 1] || methodParts[methodParts.indexOf('--request') + 1];
          newMethod = newMethod.trim();
        }
      } else if (line.startsWith('--header') || line.startsWith('-H')) {
        const headerParts = line.match(/['"]?([^'"]+)['"]?\s*:\s*['"]?([^'"]+)['"]?/);
        if (headerParts) {
          const key = headerParts[1].replace(/['"]/g, '').trim();
          const value = headerParts[2].replace(/['"]/g, '').trim();
          newHeaders.push({ key, value });
        }
      } else if (line.includes('--data-raw') || line.includes('-d')) {
        isData = true;
        newBody = line.split('--data-raw ')[1].trim().slice(1, -1);
      } else if (!line.startsWith('curl')) {
        newUrl = line.replace(/['"]/g, '').trim();
      }
    });

    setUrl(newUrl);
    setMethod(newMethod);
    setHeaders(newHeaders.length > 0 ? newHeaders : [{ key: '', value: '' }]);
    setBody(isData ? newBody : '');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>REST Client</h1>
        <div className="user-container">
          <div
            className="login-icon"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <i className="fas fa-user"></i>
            {dropdownVisible && (
              <div className="dropdown">
                <a>{username}</a>
                <a href="#">Logout</a>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="main-content">
        <SavedRequests savedRequests={savedRequests} loadRequest={loadRequest} />
        <RequestForm
          url={url}
          setUrl={setUrl}
          method={method}
          setMethod={setMethod}
          headers={headers}
          handleHeaderChange={handleHeaderChange}
          addHeaderField={addHeaderField}
          removeHeaderField={removeHeaderField}
          body={body}
          setBody={setBody}
          curlCommand={curlCommand}
          setCurlCommand={setCurlCommand}
          importCurl={importCurl}
          sendRequest={sendRequest}
          saveRequest={saveRequest}
        />
        <ResponseDisplay status={status} time={time} size={size} response={response} />
      </div>
    </div>
  );
}

export default App;
