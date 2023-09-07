import React from 'react'
import { Container, Modal, Row } from 'react-bootstrap'
import styles from "../StudentActivity.module.css"
export default function LoadingModal() {
  return (
    <div>
        <Modal show={true} centered={true}>
        <Modal.Body >
          <Container >
           
            <Row className="justify-content-center" style={{ gap: "10px",height:100,display:'flex',alignItems:"center" }}>
            <div className={styles.LoadingModal}>
                Image is capturing...
            </div>

             
            </Row>
           
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  )
}
