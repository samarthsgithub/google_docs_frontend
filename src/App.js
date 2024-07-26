import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './signup';
import Signin from './signin';
import Home from './home';
import DocumentEditor from './DocumentEditor';
import ShareableDocumentEditor from './ShareableDocumentEditor';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/documents/:id/:access_type/:token" element={<ShareableDocumentEditor/>}/>
          <Route path ="/documents/:id" element={<DocumentEditor/>}/>
 
        </Routes>
      </div>
    </Router>
  );
}

export default App;