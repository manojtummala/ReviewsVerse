import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <Container className="App-footer text-center">
      <p className="m-0">
        <a href="#privacy">Privacy</a> | <a href="#terms">Terms</a> |{" "}
        <a href="#contact">Contact</a> | &copy; Project R 2024
      </p>
    </Container>
  );
}

export default Footer;
