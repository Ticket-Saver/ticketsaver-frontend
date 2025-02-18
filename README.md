# TicketSaver Frontend

## Intended workflow

1. frontend: `User` selects an `event`
2. frontend: `User` realizes the payment trough Stripe
3. api: Stripe triggers an AWS Lambda webhook
4. backend: The AWS Lambda creates and sends an email with the `tickets`
5. frontend: `User` can see its tickets at the dashboard
6. frontend: `User` can mint an `NFT` for each acquired ticket
7. api: The minting uses the Zora protocol

## Deploys

- [TicketSaver frontend (deploy)](https://ticketsaver-frontend.netlify.app/)
- [TicketSaver Collectibles (with Zora)](https://zora.co/collect/base:0x183ea7dd84886507328e6805c7c368c0023478f9)

### Stack

- `Base` [docs](https://docs.base.org/): an Ethereum Layer-2 blockchain network
  developed by Coinbase
- `Zora` [docs](https://docs.zora.co/docs/intro): The Zora Network is a
  decentralized, scalable L2 blockchain developed specifically for creators,
  brands, and artists
- `wagmi` [docs](https://wagmi.sh/react/why): React hooks for Ethereum apps
- `Smart Wallet` [docs](https://www.smartwallet.dev/why): enables users to
  create an account in seconds with no app or extension required
