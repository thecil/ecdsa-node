import server from "./server";
import { useGenerateWallet } from "./hooks/useGenerateWallet";
import { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, Form, Stack, Card, Toast, ToastContainer } from 'react-bootstrap';

function Wallet({ address, setAddress, balance, setBalance }) {
  const { genPrivKey, publicKey, signMessage, toHex, toKeccak } = useGenerateWallet();
  const [privateKey, setPrivateKey] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const genNewPrivKey = () => {
    setMessage("");
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
      return `${_publicKeyToEth.slice(0, 6)}...${_publicKeyToEth.slice(_publicKeyToEth.length - 6, _publicKeyToEth.length)}`
    }
    return "";
  }, [_publicKeyToEth]);

  useEffect(() => {
    if (privateKey.length === 0) genNewPrivKey();
    return;
  }, [privateKey]);

  const onSubmitAddress = async () => {
    try {
      const signature = await signMessage(privateKey, message);
      if (signature) {
        try {
          const {
            data: { updated },
          } = await server.post(`newAddress`, {
            address: _publicKeyToEth,
            signature: signature,
          });
          if (updated) setShowToast(true);
          return;
        } catch (ex) {
          alert(ex.response.data.message);
          return;
        }
      }
      return;
    } catch (error) {
      alert(`Error: ${error}`);
      return;
    }

  }

  return (
    <>
      {showToast && (
        <ToastContainer position={"top-end"} className="p-3">
          <Toast onClose={() => setShowToast(false)}
            bg="success">
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>Address added: {_addressSliced}</Toast.Body>
          </Toast>
        </ToastContainer>

      )}
      <Row>
        <h1 className="text-center">Generate Wallet</h1>


        <Col>
          <Stack direction="vertical" gap={2}>
            <Card>
              <Card.Header as="h5">Private Key</Card.Header>
              <Card.Body>
                <Card.Title>Keep private key safu</Card.Title>
                <Card.Text>{_privateKeyToHex}</Card.Text>

                <Button variant="secondary">Copy</Button>
              </Card.Body>
            </Card>
            <Card>
              <Card.Header as="h5">Public Key</Card.Header>
              <Card.Body>
                <Card.Title>Share this address to receive funds</Card.Title>
                <Card.Text>{_publicKeyToEth}</Card.Text>
                <Button variant="secondary">Copy</Button>
              </Card.Body>
            </Card>
          </Stack>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Header as="h5">Sign Message</Card.Header>
            <Card.Body>
              <Card.Title>Sign a safu message to transfer funds</Card.Title>
              <Stack direction="horizontal" gap={3}>
                <Form.Control type="text" placeholder="Signature here" onChange={(e) => setMessage(e.target.value)} value={message} />
                <Button disabled={message === ""} variant="primary" size="sm" onClick={onSubmitAddress}>Sign</Button>
                <div className="vr" />
                <Button variant="outline-secondary" size="sm" onClick={genNewPrivKey}>New</Button>
              </Stack>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>

  );
}

export default Wallet;
