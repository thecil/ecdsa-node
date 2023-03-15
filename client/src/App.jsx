import Wallet from "./Wallet";
import Transfer from "./Transfer";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");

  return (
    <Container fluid>

      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />

      <Row>
        <Col><Transfer setBalance={setBalance} address={address} /></Col>
      </Row>
    </Container>


  );
}

export default App;
