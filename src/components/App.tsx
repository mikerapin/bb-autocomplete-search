import './App.css';

import React from 'react';

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Biobot Kit Search</h1>
      </header>
      <div className="row">
        <div className="six columns">
          <input type="text" name="search" onKeyDown={() => console.log('typing')} className="search-box twelve columns" />
        </div>
        <div className="two columns">
          <button type="button" onClick={() => console.log('search!')}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
