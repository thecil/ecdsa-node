import server from "../server";
import { useGenerateWallet } from "../hooks/useGenerateWallet";
import { useState, useEffect, useMemo } from "react";
import { Row, Col, Button, Form, Stack, Card } from 'react-bootstrap';


function VerifyMessage() {
    const { verifyMessage } = useGenerateWallet();

    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [addressData, setAddressData] = useState({});

    const onSubmitSignature = async () => {
        const verify = await verifyMessage(addressData.signature, message, addressData.publicKey);
        console.log("onSubmitSignature", { verify, message, addressData });
    }

    const getAddresses = async () => {
        const {
            data,
        } = await server.get(`getAddress/${address}`);
        if (data) {
            console.log("_address", data);
            setAddressData(data);
        }
    };

    useEffect(() => {
        console.log("eff", addressData)
        if (address !== "") {
            getAddresses()
        }
        return;
    }, [address]);

    return (
        <Row className="mt-2">
            <Col>
                <Card>
                    <Card.Header as="h5">Verify Message</Card.Header>
                    <Card.Body>
                        <Card.Title>Verify the safu message</Card.Title>
                        <Form.Control type="text" placeholder="Address here" onChange={(e) => setAddress(e.target.value)} value={address} />
                        {addressData.address && (
                            <Stack direction="horizontal" gap={3}>
                                <Form.Control type="text" placeholder="Signature here" onChange={(e) => setMessage(e.target.value)} value={message} />
                                <Button disabled={message === ""} variant="primary" size="sm" onClick={onSubmitSignature}>Verify</Button>
                            </Stack>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default VerifyMessage;