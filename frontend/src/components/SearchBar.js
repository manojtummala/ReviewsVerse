import React, { useState, useContext } from "react";
import { FormControl, Container, Navbar, Form } from "react-bootstrap";
import { Mic, Person } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import AccountModal from "./AccountModal";
import AuthContext from "../context/AuthContext";

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const { user } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${query}`);
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  const toggleAccountModal = () => {
    setShowAccountModal(!showAccountModal);
  };

  return (
    <div className="search-page">
      <Navbar
        className="d-flex justify-content-end"
        style={{
          background: "transparent",
          padding: "30px",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "50%",
            padding: "5px",
            cursor: "pointer",
          }}
          onClick={() => {
            if (user) {
              toggleAccountModal();
            } else {
              toggleLoginModal();
            }
          }}
        >
          <Person size={24} />
        </div>
      </Navbar>
      <Container
        className="d-flex justify-content-center"
        style={{ marginTop: "150px" }}
      >
        <Form onSubmit={handleSearch} className="search-container">
          <FormControl
            type="text"
            placeholder="Search Something"
            className="search-input"
            style={{ boxShadow: "none" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="vertical-line mx-3"></div>
          <Mic style={{ cursor: "pointer" }} />
        </Form>
      </Container>

      {/* Login Modal */}
      <LoginModal show={showLoginModal} handleClose={toggleLoginModal} />

      {/* Account Modal */}
      <AccountModal show={showAccountModal} handleClose={toggleAccountModal} />
    </div>
  );
}

export default SearchBar;
