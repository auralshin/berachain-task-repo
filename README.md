# Validator Prover

This codebase provides a service verifying the status of beacon chain validator data, primarily by interacting with a blockchain client and performing Merkle proof validations. It allows clients to initiate a process to verify validator data, track intermediate statuses, and receive the final result.

## Overview

The service is structured as a REST API with WebSocket support for real-time status updates. Clients can:

1. Initiate a verification process.
2. Receive a unique process ID for tracking.
3. Poll the status via HTTP or receive real-time updates via WebSocket.
4. Retrieve the final result once the verification completes.

## Project Structure

- **controllers/**
  - `processController.js`: Handles API requests for process initiation and status checks
- **services/**
  - `processService.js`: Manages process initiation, execution, and result processing
  - `processManager.js`: Tracks process statuses with a unique process ID
- **utils/**
  - `proofHelper.js`: Provides helper functions for proof verification
  - `websocket.js`: Sets up WebSocket connections and status updates
- **routes/**
  - `processRoutes.js`: Defines API routes for process initiation and status checks
- `app.js`: Main Express app configuration

markdown
Copy code

## Installation

### Prerequisites

- Node.js >= 14.x
- NPM >= 6.x

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/process-verification-service.git
   cd process-verification-service
   ```

## Installation

### Install Dependencies

### npm install

Create a .env file with the following variables:

```bash
PORT=3000
ALCHEMY_API_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
BEACON_ROOTS_CONTRACT=0x000F3df6D732807Ef1319fB7B8bB8522d0Beac02

```

### Run the Server

```bash
npm start
```

The server will run on http://localhost:3000 by default.

## API Endpoints

### POST `/api/process/start`

Initiates a new verification process.

#### Request

```json
{
  "slot": "finalized",
  "validatorIndex": 0
}
```

#### Response

```json
{
  "message": "Process started successfully!",
  "processId": "unique-process-id"
}
```

### GET `/api/process/status/:processId`

Retrieves the current status of a process.

#### Response

```json
{
  "status": "in-progress",
  "details": "Fetching beacon state..."
}
```

### WebSocket Usage

Connect to the WebSocket server at ws://localhost:3000.

#### To check process status:

```json
{ "action": "checkStatus", "processId": "unique-process-id" }
```

The server will periodically send updates until the process completes or fails.

#### Sample WebSocket Message

```json
{
  "processId": "unique-process-id",
  "status": "completed",
  "result": {
    "blockRoot": "0x...",
    "proof": ["0x...", "0x..."],
    "validator": { "index": 0, "status": "active" },
    "timestamp": 1234567890
  }
}
```

Sample Input & Output

#### Input

```json
{
  "slot": "10374719",
  "validatorIndex": 860435
}
```

#### Output

```json
{
  "blockRoot": "0xb4ccb50b71e53c399c5113b4ce6592bbf0cbaf5366dc5e7c5548351f38b6e782",
  "proof": [
    "0x19c7ff4e488420e97d6816fee006ce3916dbee007581899360aa60bd419ee767",
    "0x02281f3e5f0cd98a59b76a1b9201cc8c4b6133e8eb520b22a540382543a9b7c4",
    "0x4eae784d1244e9c52a571ca8936ca42fc2a0bd3cb717250a21d50ffa58f8611c",
    "0x4a5f153877fb04b2d833096f2a86b12a3f122c55a90e4ea591fcd7b83c86fcac",
    "0xb03c629f53d50231a904b600a0a4544815c78825a91859829a0d378cde9deadd",
    "0x4a78bc34dd9b8dd71b32d5ec068e63d11b5e08d8b689ecd73c432d6b9c63d441",
    "0x48d95c4d3b4dbb4990c32576ad329faf94d455c19442e9348fbbc02dcc11df71",
    "0x8fbc0d7c27588f5db2d82f9a46f6c3494d5c5bd40944ac69380b72959c2f6786",
    "0xfeaf1dce390447bf02242a7f95ea1631a35568d013eccd169fa691399e72eb5f",
    "0xe42c5ad8cd33e749799d4acd3200e617f2d3a6dd79256576b29e5063d1b5b816",
    "0xd6a4a6eabefcede6f25a9c20fff6ccb3e3b84d5d46a1052832c43cd9b186481f",
    "0x93f2a203f79e0c273018fd3eb47f2a84a87fb019d8d498c313ee12ed5591298b",
    "0xdf0c8e1d2d7a76b6585ee7e1a9cc0ac97abfc64f255ad25a6a249f717787e127",
    "0xd844145317f0af49fb286514dfb6d2ae45636602779278706d7c070769d6b005",
    "0x5ba2dc2ce25ae0508b7ba63b2a5d9ed6bfb1a6a35f4548a42370eec3a76607ac",
    "0x2ab46d38b360c977b2363d41a5f2b59c9c85e05c44a832e2b2068ea51881963a",
    "0xa4f7acbec773ccdb0fbd435d052a1e85ee391df7dc12f0860d2ffd5aa100dda6",
    "0x13ffee9c3829450fffaf434f30146686a08d441731b1113d680d2de165b574f6",
    "0xcb4064c3ef03d019d209cebfb3a8971e18b7f4751c1da370823685765af85ad5",
    "0x5acbd032023ef8a2e111722d91a20e1ff59934dfc3908cae20bbe1e07b64e699",
    "0x8bbce55717948fa15f57180ff42ea5e66db3baf5d0855d44d55461c48a0d3115",
    "0x8a8d7fe3af8caa085a7639a832001457dfb9128a8061142ad0335629ff23ff9c",
    "0xfeb3c337d7a51a6fbf00b9e34c52e1c9195c969bd4e7a0bfd51d5c5bed9c1167",
    "0xe71f0aa83cc32edfbefa9f4d3e0174ca85182eec9f3a09f6a6c0df6377a510d7",
    "0x31206fa80a50bb6abe29085058f16212212a60eec8f049fecb92d8c8e0a84bc0",
    "0x21352bfecbeddde993839f614c3dac0a3ee37543f9b412b16199dc158e23b544",
    "0x619e312724bb6d7c3153ed9de791d764a366b389af13c58bf8a8d90481a46765",
    "0x7cdd2986268250628d0c10e385c58c6191e6fbe05191bcc04f133f2cea72c1c4",
    "0x848930bd7ba8cac54661072113fb278869e07bb8587f91392933374d017bcbe1",
    "0x8869ff2c22b28cc10510d9853292803328be4fb0e80495e8bb8d271f5b889636",
    "0xb5fe28e79f1b850f8658246ce9b6a1e7b49fc06db7143e8fe0b4f2b0c5523a5c",
    "0x985e929f70af28d0bdd1a90a808f977f597c7c778c489e98d3bd8910d31ac0f7",
    "0xc6f67e02e6e4e1bdefb994c6098953f34636ba2b6ca20a4721d2b26a886722ff",
    "0x1c9a7e5ff1cf48b4ad1582d3f4e4a1004f3b20d8c5a2b71387a4254ad933ebc5",
    "0x2f075ae229646b6f6aed19a5e372cf295081401eb893ff599b3f9acc0c0d3e7d",
    "0x328921deb59612076801e8cd61592107b5c67c79b846595cc6320c395b46362c",
    "0xbfb909fdb236ad2411b4e4883810a074b840464689986c3f8a8091827e17c327",
    "0x55d8fb3687ba3ba49f342c77f5a1f89bec83d811446e1a467139213d640b6a74",
    "0xf7210d4f8e7e1039790e7bf4efa207555a10a6db1dd4b95da313aaa88b88fe76",
    "0xad21b516cbc645ffe34ab5de1c8aef8cd4e7f8d2b51e8e1456adc7563cda206f",
    "0x8f4c190000000000000000000000000000000000000000000000000000000000",
    "0xf7ed1a0000000000000000000000000000000000000000000000000000000000",
    "0xe38a243fb00a6cf8e50a124dbe1b5f8acfb5d44c78275f4ae1951f23f3fb96e8",
    "0x61afa3ecd8b13c64f49ee6da880f065a1ff6b89465a10f4b5145251f4704165c",
    "0x89082ff704489c37d4c48297644bbcd6afa13c71909e455bca742b623a5ef7bf",
    "0x5d2fb3d1fe940e87a3d7d8d438953f95d4db44c13d51c0976f6a9518d1645d47",
    "0x774a9f976e0adb87bf985fefea08c3e62aeefd4c2075b59eb7a60f57ff0e6173",
    "0x586e4202380653c1c1f0d453913b91bbb8a60e9a25667a04f33e1cd629b0d311",
    "0xeb1568207b9eb72964903c4604ea333dd8f7f9875c9fc0d2e7fb5b0e1169a1a3"
  ],
  "validator": {
    "pubkey": "0x805fd5df04173f249bb384b885cfe638a47a02f3c5b98c1e7329397bceca2bd9935f19ab45dac76a5764d8c47367d8f8",
    "withdrawal_credentials": "0x01000000000000000000000061fa6204b232b3e8f3eb388b50a2f2574c9052a6",
    "effective_balance": "32000000000",
    "slashed": false,
    "activation_eligibility_epoch": "218273",
    "activation_epoch": "226013",
    "exit_epoch": "18446744073709551615",
    "withdrawable_epoch": "18446744073709551615"
  },
  "validatorIndex": 860435,
  "timeStamp": 1731320663,
  "verificationStatus": true
}
```

## Technical Docs

[Technical Docs](./TechnicalDocumentation.md)
