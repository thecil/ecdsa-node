import { useState, useMemo, useEffect } from "react";
import server from "./server";
import { Row, Col, Button, Form, InputGroup, Spinner } from "react-bootstrap";

function Transfer() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [signature, setSignature] = useState("");
  const [balance, setBalance] = useState(0);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  const fetchBalance = async () => {
    setLoading(true);
    setIsError(false);
    try {
      const {
        data: { balance },
      } = await server.get(`balance/${from}`);

      if (balance > 0) {
        setBalance(balance);
        setLoading(false);
        return;
      }

    } catch (error) {
      console.log("fetchBalance:Error:", error);
      setBalance(0);
      setLoading(false);
      setIsError(true);
      return;
    }
  }
  useEffect(() => {
    if (from === "") setLoading(false);

    fetchBalance();

    return;
  }, [from]);

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <h1 className="text-center">Send Transaction</h1>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formFrom">
          <Form.Label>From</Form.Label>
          <Form.Control size="sm" required type="text" placeholder="Your Address" onChange={(e) => setFrom(e.target.value)} value={from} />
          {loading && (
            <Spinner className="mt-1" animation="border" variant="primary" />
          )}
          {balance > 0 && !loading && (
            <Form.Text id="addressBalance" muted>Amount Available: {balance}</Form.Text>
          )}
          {from !== "" && isError && !loading && (
            <Form.Text id="errorBalance" muted>Incorrect Address</Form.Text>
          )}
        </Form.Group>

        <Form.Group as={Col} controlId="formTo">
          <Form.Label>To</Form.Label>
          <Form.Control size="sm" required type="text" placeholder="Public Address" onChange={(e) => setTo(e.target.value)} value={to} />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="formAmount">
          <Form.Label>Amount</Form.Label>
          <InputGroup>
            <Form.Control disabled={balance === 0} size="sm" required type="number" placeholder="0.1" onChange={(e) => setAmount(e.target.value)} value={amount} />
            <Button onClick={() => setAmount(balance)} disabled={balance === 0} size="sm" variant="outline-secondary" id="button-addon2">
              Max
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} controlId="formAmount">
          <Form.Label>Signature</Form.Label>
          <Form.Control size="sm" required type="text" placeholder="Your safu message" onChange={(e) => setSignature(e.target.value)} value={signature} />
        </Form.Group>
      </Row>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default Transfer;
