import React, { useState, useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import AppleSignin from "react-apple-login";
import { Modal, Button, Form } from "react-bootstrap";
import { Apple } from "react-bootstrap-icons";
import google from "../icons/google.svg";
import AuthContext from "../context/AuthContext";
import { loginWithGoogle, loginWithApple } from "../utils/auth";

const LoginModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, login } = useContext(AuthContext);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const user = await loginWithGoogle(tokenResponse);
        setUser(user);
        handleClose();
      } catch (error) {
        console.error("Google login failed:", error);
      }
    },
    onError: (error) => {
      console.log("Google login failed:", error);
    },
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      setUser(user);
      handleClose();
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="login-modal">
      <Modal.Body className="p-5">
        <div className="login-buttons gap-5">
          <Button
            variant="light"
            onClick={googleLogin}
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <img src={google} alt="Google" />
          </Button>
          <AppleSignin
            clientId="YOUR_APPLE_CLIENT_ID"
            redirectURI="YOUR_APPLE_REDIRECT_URI"
            render={(props) => (
              <Button
                variant="light"
                onClick={props.onClick}
                disabled={props.disabled}
                style={{ backgroundColor: "transparent", border: "none" }}
              >
                <Apple size={40} style={{ color: "#000000" }} />
              </Button>
            )}
            onSuccess={async (response) => {
              try {
                const user = await loginWithApple(response);
                setUser(user);
                handleClose();
              } catch (error) {
                console.error("Apple login failed:", error);
              }
            }}
            onError={(error) => {
              console.log("Apple login failed:", error);
            }}
          />
        </div>
        <hr className="mx-5 mb-3" />
        <Form onSubmit={handleEmailLogin}>
          <Form.Group controlId="formBasicEmail" className="mb-2">
            <Form.Control
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              style={{ backgroundColor: "#E9EAEB", fontSize: "small" }}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="mb-2">
            <div className="d-flex align-items-center">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                style={{ backgroundColor: "#E9EAEB", fontSize: "small" }}
              />
            </div>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <a href="#" className="forgot-password mx-3 mb-3">
              Forgot password?
            </a>
          </div>
          <div>
            <Button
              type="submit"
              variant="success"
              className="login-submit"
              style={{ width: "100%" }}
            >
              Log in
            </Button>
          </div>
        </Form>
        <div className="text-center mt-2">
          <span style={{ fontSize: "small" }}>Don’t have an account?</span>{" "}
          <a href="#" className="create-account">
            Create one
          </a>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
