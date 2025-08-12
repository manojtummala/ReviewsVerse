import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import AuthContext from "../context/AuthContext";
import { logout } from "../utils/auth";

const AccountModal = ({ show, handleClose }) => {
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    handleClose();
    window.location.reload();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="account-modal"
      style={{
        borderRadius: "0",
        maxWidth: "none",
        width: "100%",
        height: "100%",
        margin: "0",
        position: "fixed",
        right: "0",
        top: "0",
      }}
    >
      <Modal.Body
        className="p-5"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
        }}
      >
        <div
          className="d-flex align-items-center mb-4 mt-3"
          style={{ marginBottom: "2rem" }}
        >
          <Person size={30} style={{ color: "#000" }} />
          <div className="ml-3" style={{ marginLeft: "1rem" }}>
            <h5 style={{ margin: 0, fontSize: "1.25rem" }}>{user?.name}</h5>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#888" }}>
              {user?.email}
            </p>
          </div>
        </div>

        <div
          className="p-3 mt-3"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <div className="d-flex flex-column" style={{ flexGrow: 1 }}>
            <Button
              variant="link"
              className="text-left mb-2"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontSize: "1rem",
                textAlign: "left",
                width: "100%",
                padding: "0.5rem 0",
                borderBottom: "1px solid #ddd",
              }}
              onClick={() => {
                /* Handle myProfile */
              }}
            >
              My Profile
            </Button>
            <Button
              variant="link"
              className="text-left mb-2"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontSize: "1rem",
                textAlign: "left",
                width: "100%",
                padding: "0.5rem 0",
                borderBottom: "1px solid #ddd",
              }}
              onClick={() => {
                /* Handle notifications */
              }}
            >
              Notifications
            </Button>
            <Button
              variant="link"
              className="text-left mb-2"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontSize: "1rem",
                textAlign: "left",
                width: "100%",
                padding: "0.5rem 0",
                borderBottom: "1px solid #ddd",
              }}
              onClick={() => {
                /* Handle myReviews */
              }}
            >
              My Reviews
            </Button>
            <Button
              variant="link"
              className="text-left"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontSize: "1rem",
                textAlign: "left",
                width: "100%",
                padding: "0.5rem 0",
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AccountModal;
