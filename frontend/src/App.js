import React from "react";
import "./App.css";
import "./styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import SearchResultsPage from "./components/SearchResults";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<SearchBar />} />
                <Route path="/search" element={<SearchResultsPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
