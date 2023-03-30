const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak")

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const DEFAULT_AMOUNT = 100;
const balances = [];

const toKeccak = (value) => keccak256(value);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  if (balances.length == 0) return res.status(400).send({ message: "Balances Empty" });

  if (balances.length > 0) {
    const balance = balances.find(value => value.address == address);
    if (balance) {
      // console.log("/balance", balance);
      res.send({ balance: balance.amount });
      return;
    }
    if (!balance) return res.status(400).send({ message: "No Balance" });
  }
});

app.get("/getAddress/:address", (req, res) => {
  const { address } = req.params;
  if (balances.length == 0) return res.status(400).send({ message: "Address Empty" });
  const _exist = balances.find(value => value.address == address);
  // console.log("getAddress", _exist.address)
  res.send({ ..._exist });
});

app.get("/getAddresses", (req, res) => {
  if (balances.length == 0) return res.status(400).send({ message: "Balances Empty" });
  const _addresses = balances.map(value => value.address);
  // console.log("getAddresses", _addresses)
  res.send({ addresses: _addresses });
});

app.post("/newAddress", (req, res) => {
  const { address, signature, publicKey } = req.body;

  if (balances.length == 0) {
    balances.push({ address, amount: DEFAULT_AMOUNT, signature, publicKey });
    // console.log("newAddress, first address", balances[0]);
    res.send({ updated: true });
    return;
  }

  const _exist = balances.find(value => value.address == address);

  if (!_exist) {
    balances.push({ address, amount: DEFAULT_AMOUNT, signature, publicKey });
    res.send({ updated: true });
    // console.log("newAddress", balances[balances.length - 1]);
    return;
  }

  res.send({ updated: false });
  return;
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, message } = req.body;
  if (balances.length == 0) return res.status(400).send({ message: "Balances Empty" });

  if (balances.length > 0) {
    const _sender = balances.findIndex(value => value.address == sender);
    const _recipient = balances.findIndex(value => value.address == recipient);

    if (_sender == -1 || _recipient == -1) return res.status(400).send({ message: "Sender or Recipient does not exist" });

    if (balances[_sender].amount < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    }

    const _messageHash = toHex(toKeccak(utf8ToBytes(message.trim())));
    const _signature = balances[_sender].signature;
    const _publicKey = balances[_sender].publicKey;

    const isValid = secp.verify(_signature, _messageHash, _publicKey);
    // console.log("verify", isValid, balances[_sender].address);

    if (!isValid) {
      return res.status(400).send({ message: "Signature does not match" });
    }

    if (isValid) {
      balances[_sender].amount -= amount;
      balances[_recipient].amount += amount;

      res.send({ updated: true });
      // console.log("body", { sender, recipient, amount, message });
      // console.log("sending funds", [_sender, _recipient, balances[_sender].amount, balances[_recipient].amount])

      return;
    }

  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});


