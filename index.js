const {MerkleTree} = require("merkletreejs");
const keccak256 = require("keccak256");
const { createServer } = require("http");
const csv = require('csv-parser')
const fs = require('fs')
const cors = require("cors");
const app = require("express")();
var bodyParser = require('body-parser'); 
app.use(cors());
app.use(bodyParser.json()); 
const server = createServer(app);
const port = process.env.PORT || 3000;
const path = require('path');

let merkleTree;
let rootHash;

let addresses = [];

// Pull all data from wallet_address column in CSV to build tree
let file = path.join(process.cwd(), 'data.csv')
fs.createReadStream(file)
  .pipe(csv())
  .on('data', (data) => addresses.push(data.wallet_address))
  .on('end', () => {
    // Startup server and create the tree
    server.listen(port, () => {
        console.log(`Starting server on port ${port}`);
        makeMerkleTree();
    });
  });


// Dummy index
app.get('/', (req, res) => {
    res.status(404);
});

// Proof checker
app.post('/', (req, res) => {
    // Check against tree + verify proof
    const address = req.query.address;
    let hexProof = checkTreeForAddress(address);
    res.json({data: hexProof});
});

// Get root
app.get('/root', (req, res) => {
    const root = rootHash;
    res.json({data: root});
});

// Tree maker
function makeMerkleTree() {
    // Hash addresses to get the leaves
    let leaves = addresses.map(addr => keccak256(addr))
    // Create tree
    merkleTree = new MerkleTree(leaves, keccak256, {sortPairs: true})
    // Find root
    rootHash = merkleTree.getRoot().toString('hex')
    if (rootHash) {
        console.log("rootHash", rootHash);
    }
    // Display tree
    console.log(merkleTree.toString());
    return rootHash;
}

// Check if tree contains address and return proof
function checkTreeForAddress(address) {
    let hashedAddress = keccak256(address);
    let hexProof = merkleTree.getHexProof(hashedAddress);
    console.log(`Proof for address - ${address}`, hexProof);
    const verified = merkleTree.verify(hexProof, hashedAddress, rootHash)
    if (verified) {
        return hexProof;
    } else {
        return [];
    }
}

