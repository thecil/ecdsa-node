import Wallet from "./Wallet";
import Transfer from "./Transfer";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';

function App() {

  return (
    <Container fluid>

      <Wallet />

      <Row>
        <Col><Transfer/></Col>
      </Row>
    </Container>


  );
}

export default App;
