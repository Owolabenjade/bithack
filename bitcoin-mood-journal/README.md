# Bitcoin Mood Journal

A simple mood journaling application built for the Buidl Battle Hackathon. This app allows users to record their daily thoughts with emotional sentiment tags, storing them permanently on the Bitcoin blockchain using Ordinals.

## Overview

Bitcoin Mood Journal demonstrates how Ordinals can be used for personal data applications rather than just collectibles or art. Users can:

- Record their moods and thoughts
- Store entries on the Stacks blockchain
- Create permanent inscriptions on Bitcoin using Ordinals
- View their mood history

## Technical Implementation

This project uses:

- **Clarity Smart Contracts** on Stacks for storing journal entries and metadata
- **React** for the frontend user interface
- **Stacks.js** for blockchain interaction
- **Bitcoin Ordinals** for permanent on-chain storage

## Quick Start

### Prerequisites

- Node.js 16+
- Clarinet for Clarity development
- A Stacks wallet (like Hiro Wallet or Xverse)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Owolabenjade/bitcoin-mood-journal.git
cd bitcoin-mood-journal
```

2. Install dependencies
```bash
npm install
cd web
npm install
```

3. Deploy the contracts (Testnet)
```bash
npm run deploy:testnet
```

4. Start the development server
```bash
npm start
```

5. Open your browser at `http://localhost:3000`

## Project Structure

- `/contracts` - Clarity smart contracts
- `/web` - React frontend application
- `/tests` - Test files for the smart contracts

## Buidl Battle Submission

This project is a submission for the "Real World Utility" theme of the Buidl Battle Hackathon, demonstrating how Bitcoin and Ordinals can be used for practical personal applications beyond financial transactions or collectibles.

## Future Enhancements

With more time, additional features could include:

- Mood analysis and trend visualization
- Encrypted entries for increased privacy
- Integration with mental health resources
- Group or shared journals for team mood tracking
- Calendar view for long-term mood tracking

## License

MIT