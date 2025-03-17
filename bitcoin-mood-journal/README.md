# Bitcoin Mood Journal - Project Documentation

## Overview

Bitcoin Mood Journal is an innovative application that enables users to record their daily thoughts and emotions on the Bitcoin blockchain using Ordinals. This documentation provides a comprehensive overview of the project's architecture, components, and implementation details.

## Table of Contents

1. [Project Purpose](#project-purpose)
2. [Technical Architecture](#technical-architecture)
3. [Smart Contracts](#smart-contracts)
4. [Frontend Implementation](#frontend-implementation)
5. [Bitcoin & sBTC Integration](#bitcoin--sbtc-integration)
6. [Setup Instructions](#setup-instructions)
7. [Usage Guide](#usage-guide)
8. [Future Enhancements](#future-enhancements)

## Project Purpose

Bitcoin Mood Journal demonstrates a practical real-world utility for Bitcoin Ordinals beyond collectibles and artwork. By enabling users to record their emotional states and personal reflections as permanent inscriptions on the Bitcoin blockchain, the application creates an immutable record of one's emotional journey through time.

Key value propositions:
- **Emotional Tracking**: Record moods and reflections that can't be altered or deleted
- **Personal Growth**: Review past emotional states and identify patterns over time
- **Data Ownership**: Users retain complete ownership of their personal data
- **Blockchain Utility**: Demonstrates practical usage of Bitcoin beyond financial transactions

## Technical Architecture

The project uses a hybrid architecture combining Stacks and Bitcoin:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Stacks Chain   │────▶│  Bitcoin Chain  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
    User Interface        Smart Contracts         Ordinal Storage
```

### Components Interaction

1. Users interact with the React frontend to create journal entries
2. Journal entries are stored on the Stacks blockchain via Clarity smart contracts
3. Users can create permanent Ordinal inscriptions of their entries on Bitcoin
4. sBTC is used to streamline the payment process for creating inscriptions

## Smart Contracts

The project uses two Clarity smart contracts deployed on the Stacks blockchain:

### bitcoin-mood-journal.clar

The main contract that handles storing journal entries and managing references to Ordinal inscriptions.

```clarity
;; Main data structures
(define-map entries
  { entry-id: uint }
  {
    owner: principal,
    content: (string-utf8 250),
    mood: uint,
    timestamp: uint,
    inscription-id: (optional (string-utf8 64))
  }
)

(define-map user-entries
  { owner: principal }
  { entry-ids: (list 100 uint) }
)

;; Public functions
(define-public (add-entry (content (string-utf8 250)) (mood uint)) ...)
(define-public (set-inscription-id (entry-id uint) (inscription-id (string-utf8 64))) ...)

;; Read functions
(define-read-only (get-entry (entry-id uint)) ...)
(define-read-only (get-user-entry-ids (user principal)) ...)
```

### mood-utils.clar

Utility contract that provides helper functions for mood formatting and display.

```clarity
;; Mood constants
(define-constant MOOD_HAPPY u1)
(define-constant MOOD_SAD u2)
(define-constant MOOD_NEUTRAL u3)
(define-constant MOOD_ANXIOUS u4)
(define-constant MOOD_EXCITED u5)

;; Helper functions
(define-read-only (get-mood-name (mood-id uint)) ...)
(define-read-only (get-mood-emoji (mood-id uint)) ...)
```

## Frontend Implementation

The frontend is built with React and includes the following key components:

### Component Structure

- **App.js**: Main application component with routing and state management
- **Header.js**: Simple header displaying the application name
- **ConnectWallet.js**: Component handling Stacks wallet authentication
- **JournalEntry.js**: Form for creating new mood journal entries
- **MoodSelector.js**: Component for selecting the current mood
- **EntryList.js**: Component for displaying past journal entries

### Key Features

1. **Wallet Integration**: Connect with Stacks wallet for authentication
2. **Mood Selection**: Choose from five different moods (Happy, Sad, Neutral, Anxious, Excited)
3. **Journal Creation**: Write and save journal entries with selected moods
4. **Entry Timeline**: View past entries in chronological order
5. **Ordinal Creation**: Create Bitcoin Ordinals from journal entries
6. **sBTC Payments**: Streamlined payment process for Ordinal creation

### State Management

The application uses React's useState and useEffect hooks for state management:

```javascript
// Main state elements
const [userData, setUserData] = useState(null);        // User authentication data
const [entries, setEntries] = useState([]);            // Journal entries
const [activeTab, setActiveTab] = useState('new');     // Current active tab
const [entryCount, setEntryCount] = useState(3);       // Count of entries
```

## Bitcoin & sBTC Integration

### Ordinal Inscriptions

Journal entries can be permanently stored on Bitcoin using Ordinals inscriptions. The process works as follows:

1. User creates a journal entry which is stored in the Stacks contract
2. User selects "Create Ordinal Inscription with sBTC" for a specific entry
3. Application presents payment options with sBTC as the recommended method
4. User confirms payment, and the application creates the inscription
5. The inscription ID is stored in the Stacks contract, linking to the Bitcoin inscription

### sBTC Payment Flow

The application demonstrates how sBTC simplifies the payment process for creating inscriptions:

1. Calculate inscription fee and network fee
2. Present payment options (sBTC vs on-chain BTC)
3. Process sBTC payment (lower fees, faster confirmation)
4. Create the Ordinal inscription
5. Update the entry with the inscription ID

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn
- Clarinet (for smart contract development)
- A Stacks wallet (Hiro Wallet or Xverse)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bitcoin-mood-journal.git

# Navigate to project directory
cd bitcoin-mood-journal

# Install dependencies
npm install

# Start the development server
npm start
```

### Smart Contract Deployment

```bash
# Deploy to testnet (requires Clarinet)
clarinet deploy --testnet
```

## Usage Guide

### Connecting a Wallet

1. Visit the application homepage
2. Click the "Connect Wallet" button
3. Follow the authentication prompts from your Stacks wallet

### Creating a Journal Entry

1. Navigate to the "New Entry" tab
2. Select your current mood from the mood selector
3. Write your thoughts in the journal entry field (up to 250 characters)
4. Click "Save Entry" to store your entry

### Viewing Past Entries

1. Navigate to the "My Journal" tab
2. Browse through your past entries in chronological order
3. Each entry displays the mood, date, and content

### Creating an Ordinal Inscription

1. Navigate to the "My Journal" tab
2. Find an entry without an inscription
3. Click "Create Ordinal Inscription with sBTC"
4. Review the fee details in the payment modal
5. Confirm payment to create the inscription
6. Once complete, view your inscription on the Ordinals Explorer

## Future Enhancements

### Short-term Improvements

1. **Mood Analytics**: Visualize trends in emotional states over time
2. **Calendar View**: Display entries on a calendar interface
3. **Enhanced Privacy**: Add encryption options for sensitive entries

### Long-term Vision

1. **Mental Health Integration**: Connect with mental health professionals
2. **Multi-chain Support**: Expand to additional blockchain networks
3. **AI Analysis**: Optional sentiment analysis of journal entries
4. **Mobile Application**: Native mobile experience

---

## Development Notes

This documentation covers the design and implementation of Bitcoin Mood Journal. The project demonstrates how Bitcoin and Stacks can be combined to create applications with real-world utility, expanding the use cases for Bitcoin beyond financial transactions.

The application showcases how sBTC can streamline interactions with Bitcoin, particularly for creating Ordinals inscriptions, by providing a more user-friendly payment experience with lower fees.