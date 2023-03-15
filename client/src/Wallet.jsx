import server from "./server";
import { useGenerateWallet } from "./hooks/useGenerateWallet";
import { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, Form, Stack, Card, Toast } from 'react-bootstrap';

function Wallet({ address, setAddress, balance, setBalance }) {
  const { genPrivKey, publicKey, toHex, toKeccak } = useGenerateWallet();
  const [privateKey, setPrivateKey] = useState([]);
  const [showToast, setShowToast] = useState(false);


  const genNewPrivKey = () => {
    setPrivateKey(genPrivKey());
  }

  const _privateKeyToHex = useMemo(() => {
    if (privateKey.length > 0) return toHex(privateKey);
    return "";
  }, [privateKey]);

  const _publicKey = useMemo(() => {
    if (privateKey.length > 0) return publicKey(privateKey);
  }, [privateKey]);

  const _publicKeyToEth = useMemo(() => {
    if (_publicKey && _publicKey.length > 0) {
      const _toEth = `0x${toHex(toKeccak(_publicKey))}`
      return _toEth;
    }
    return "";
  }, [_publicKey]);

  const _addressSliced = useMemo(() => {
    if (_privateKeyToHex.length > 0) {
      return `${_publicKeyToEth.slice(0, 4)}...${_publicKeyToEth.slice(_publicKeyToEth.length - 4, _publicKeyToEth.length)}`
    }
    return "";
  }, [_publicKeyToEth]);
  useEffect(() => {
    if (privateKey.length === 0) genNewPrivKey();
    return;
  }, [privateKey]);

  const onSubmitAddress = async () => {
    try {
      const {
        data: { updated },
      } = await server.post(`newAddress`, {
        address: _publicKeyToEth,
        signature: "signature",
      });
      if (updated) setShowToast(true);

    } catch (ex) {
      alert(ex.response.data.message);
    }

  }

  return (
    <>
      <Row>
        <h1>Generate Wallet</h1>
        {showToast && (
          <Col>
            <Toast onClose={() => setShowToast(false)} className="d-inline-block m-1"
              bg="success">
              <Toast.Header>
                <strong className="me-auto">Success</strong>
              </Toast.Header>
              <Toast.Body>Address added: {_addressSliced}</Toast.Body>
            </Toast>
          </Col>
        )}

        <Col>
          <Stack direction="vertical" gap={2}>
            <Card>
              <Card.Header as="h5">Private Key</Card.Header>
              <Card.Body>
                <Card.Text>{_privateKeyToHex}</Card.Text>
                <Button variant="secondary">Copy</Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h5">Public Key</Card.Header>
              <Card.Body>
                <Card.Text>{_publicKeyToEth}</Card.Text>
                <Button variant="secondary">Copy</Button>
              </Card.Body>
            </Card>
          </Stack>


        </Col>
        <Stack direction="horizontal" gap={3}>
          <Form.Control className="me-auto" placeholder="Secret Here..." />
          <Button variant="primary" onClick={onSubmitAddress}>Submit</Button>
          <div className="vr" />
          <Button variant="secondary" onClick={genNewPrivKey}>Generate New</Button>
        </Stack>
      </Row>

      <Row>
        <Col>Col</Col>
      </Row>
    </>

  );
}

export default Wallet;
