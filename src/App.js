import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import RequestForm from './RequestForm';
import ResponseDisplay from './ResponseDisplay';

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

  const importCurl = () => {
    const lines = curlCommand.split('\\\n').map(line => line.trim());
    let newMethod = 'GET';
    let newUrl = '';
    let newHeaders = [];
    let newBody = '';
    let isData = false;

    lines.forEach(line => {
      if (line.startsWith('curl')) return;
      if (line.startsWith('-X') || line.startsWith('--request')) {
        const methodParts = line.split(' ');
        if (methodParts.length > 1) {
          newMethod = methodParts[1].trim();
        }
        console.log('Parsed Method:', newMethod);
      } else if (line.startsWith('--header') || line.startsWith('-H')) {
        const headerParts = line.match(/['"]?([^'"]+)['"]?\s*:\s*['"]?([^'"]+)['"]?/);
        if (headerParts) {
          const key = headerParts[1].replace(/['"]/g, '').trim();
          const value = headerParts[2].replace(/['"]/g, '').trim();
          newHeaders.push({ key, value });
          console.log('Parsed Header:', { key, value });
        }
      } else if (line.startsWith('--data-raw') || line.startsWith('-d')) {
        isData = true;
        newBody = line.split('--data-raw ')[1].trim().slice(1, -1);
        console.log('Parsed Body:', newBody);
      } else {
        newUrl = line.replace(/['"]/g, '').trim();
        console.log('Parsed URL:', newUrl);
      }
    });

    console.log('Final Parsed Method:', newMethod);
    setUrl(newUrl);
    setMethod(newMethod);
    setHeaders(newHeaders.length > 0 ? newHeaders : [{ key: '', value: '' }]);
    setBody(isData ? newBody : '');
  };

  return (
    <div className="app-container">
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
      />
      <ResponseDisplay status={status} time={time} size={size} response={response} />
    </div>
  );
}

export default App;