import React from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";

export default function EndActivityModal({
  showModal,
  handleActivityStatus,
  closeModal,
}) {
  return (
    <>
      <Modal show={showModal} className="bootstrap">
        <Modal.Body>
          <Container>
            <h4>Do you want to complete the activity?</h4>
            <Row className="justify-content-center" style={{ gap: "10px" }}>
              <Button
                onClick={() => handleActivityStatus(1)}
                className="primary-button"
                style={{ background: "green" }}
              >
                Yes : Complete Now
              </Button>

              <Button
                className="primary-button"
                style={{ background: "red" }}
                onClick={() => handleActivityStatus(0)}
              >
                No : Close
              </Button>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
