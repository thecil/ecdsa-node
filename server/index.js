const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const DEFAULT_AMOUNT = 100;

const balances = [];

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  if (balances.length == 0) return res.status(400).send({ message: "Balances Empty" });

  if (balances.length > 0) {
    const balance = balances.find(value => value.address == address);
    if (balance) {
      console.log("/balance", balance);
      res.send({ balance: balance.amount });
      return;
    }
    if (!balance) return res.status(400).send({ message: "No Balance" });
  }
});

app.get("/getAddresses", (req, res) => {
  if (balances.length == 0) return res.status(400).send({ message: "Balances Empty" });
  const _addresses = balances.map(value => value.address);
  console.log("getAddresses", _addresses)
  res.send({ addresses: _addresses });
});

app.post("/newAddress", (req, res) => {
  const { address, signature } = req.body;

  if (balances.length == 0) {
    balances.push({ address, amount: DEFAULT_AMOUNT, signature });
    console.log("newAddress, first address", balances);
    res.send({ updated: true });
    return;
  }

  const _exist = balances.find(value => value.address == address);

  if (!_exist) {
    balances.push({ address, amount: DEFAULT_AMOUNT, signature });
    res.send({ updated: true });
    console.log("newAddress", balances);
    return;
  }

  res.send({ updated: false });
  return;
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (balances.length == 0) {
    const balance = balances.find(value => value.address == address);
    if (balance) {
      return balance.amount;
    }
    return 0;
  }
  return 0;
}

