import React, { useState } from 'react';
import './App.css';
import snooLogo from './snoo_logo.png'; // Make sure the file name matches

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results);
    } catch (e) {
      setError("Failed to fetch data. Make sure your backend is running.");
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={snooLogo} // Use the imported image here
          alt="Reddit Logo"
          style={{ height: '50px', marginBottom: '10px' }}
        />
        <h1>Reddit Analytics Tool</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a keyword or subreddit"
            style={{ padding: '10px', width: '300px' }}
          />
          <button type="submit" style={{ padding: '10px', marginLeft: '10px' }}>
            Analyze
          </button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div style={{ textAlign: 'left', marginTop: '20px' }}>
          {results.length > 0 && <h2>Results:</h2>}
          {results.map((item, index) => (
            <div key={index} style={{ border: '1px solid #fff', padding: '10px', marginBottom: '10px' }}>
              <p><strong>Title:</strong> {item.title}</p>
              <p><strong>Score:</strong> {item.score}</p>
              <p><strong>Comments:</strong> {item.num_comments}</p>
              <p><strong>URL:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a></p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;