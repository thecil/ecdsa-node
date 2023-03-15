import { useState, useMemo, useEffect } from "react";
import server from "./server";
import { Row, Col, Button, Form, InputGroup, Spinner } from "react-bootstrap";

function Transfer() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [toAddresses, setToAddresses] = useState([]);
  const [amount, setAmount] = useState(0);
  const [signature, setSignature] = useState("");
  const [balance, setBalance] = useState(0);
  const [loadingAMount, setLoadingAmount] = useState(false);
  const [isError, setIsError] = useState(false);

  const getAddresses = async () => {
    const {
      data: { addresses },
    } = await server.get(`getAddresses`);
    console.log("addresses", addresses);
    if (addresses && addresses.length > 0) {
      setToAddresses(addresses);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('handlesubmit')
  };

  const getBalance = async () => {
    setLoadingAmount(true);
    setIsError(false);
    try {
      const {
        data: { balance },
      } = await server.get(`balance/${from}`);
      console.log("bal", balance)
      if (balance > 0) {
        setBalance(balance);
        setLoadingAmount(false);
        return;
      }

    } catch (error) {
      console.log("getBalance:Error:", error);
      setBalance(0);
      setLoadingAmount(false);
      setIsError(true);
      return;
    }
  }

  useEffect(() => {
    
    if (toAddresses.length === 0) getAddresses()
    return;
  }, [toAddresses]);

  useEffect(() => {
    if (from !== "") {
      getBalance();
      return;
    }

    setLoadingAmount(false)
    return;
  }, [from]);

  const fromIsValid = useMemo(() => {
    return (from !== "" && balance > 0);
  }, [from, balance]);

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-center">Send Transaction</h1>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFrom">
          <Form.Label>From</Form.Label>
          <Form.Control size="sm" required type="text" placeholder="Your Address" onChange={(e) => setFrom(e.target.value)} value={from} />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>

          {loadingAMount && (
            <Spinner className="mt-1" animation="border" variant="primary" />
          )}
          {balance > 0 && !loadingAMount && (
            <Form.Text id="addressBalance" muted>Amount Available: {balance}</Form.Text>
          )}
          {from !== "" && isError && !loadingAMount && (
            <Form.Text id="errorBalance" muted>Incorrect Address</Form.Text>
          )}
        </Form.Group>

        <Form.Group as={Col} controlId="formTo">
          <Form.Label>To</Form.Label>
          <Form.Select disabled={!fromIsValid} size="sm" onChange={(e) => setTo(e.target.value)} value={to} >
            {toAddresses.map(address => {
              return (<option disabled={from === address} value={address}>{address}</option>)
            })}
          </Form.Select>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formAmount">
          <Form.Label>Amount</Form.Label>
          <InputGroup>
            <Form.Control disabled={!fromIsValid} size="sm" required type="number" placeholder="0.1" onChange={(e) => setAmount(e.target.value)} value={amount} />
            <Button onClick={() => setAmount(balance)} disabled={!fromIsValid} size="sm" variant="outline-secondary" id="button-addon2">
              Max
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} controlId="formAmount">
          <Form.Label>Signature</Form.Label>
          <Form.Control disabled={!fromIsValid} size="sm" required type="text" placeholder="Your safu message" onChange={(e) => setSignature(e.target.value)} value={signature} />
        </Form.Group>
      </Row>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default Transfer;
