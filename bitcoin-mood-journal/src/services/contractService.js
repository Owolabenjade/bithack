import { 
  openContractCall, 
  UserSession, 
  AppConfig 
} from '@stacks/connect';
import { 
  stringUtf8CV, 
  uintCV, 
  cvToValue,
  principalCV 
} from '@stacks/transactions';

// Create a new UserSession instance
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

// Contract details
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const contractName = 'bitcoin-mood-journal';
const network = process.env.REACT_APP_NETWORK || 'testnet';

// Add a new journal entry
export const addJournalEntry = async (content, moodId) => {
  if (!userSession.isUserSignedIn()) {
    throw new Error('User not signed in');
  }

  const functionName = 'add-entry';
  const functionArgs = [
    stringUtf8CV(content),
    uintCV(moodId)
  ];

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    appDetails: {
      name: 'Bitcoin Mood Journal',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: data => {
      console.log('Transaction submitted:', data);
      return data;
    }
  };

  return openContractCall(options);
};

// Set inscription ID for an entry
export const setInscriptionId = async (entryId, inscriptionId) => {
  if (!userSession.isUserSignedIn()) {
    throw new Error('User not signed in');
  }

  const functionName = 'set-inscription-id';
  const functionArgs = [
    uintCV(entryId),
    stringUtf8CV(inscriptionId)
  ];

  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    appDetails: {
      name: 'Bitcoin Mood Journal',
      icon: window.location.origin + '/logo.png',
    },
    onFinish: data => {
      console.log('Transaction submitted:', data);
      return data;
    }
  };

  return openContractCall(options);
};

// For the hackathon demo, we'll use mock data to avoid blockchain calls
// In a production app, these would make real contract calls

// Get a specific entry
export const getEntry = async (entryId) => {
  // Mock implementation for demo
  const mockEntries = {
    1: {
      id: 1,
      content: "Feeling really productive today! Got a lot done on my hackathon project.",
      mood: 1, // Happy
      timestamp: new Date('2025-03-15T14:30:00').getTime(), // Use proper date
      owner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      inscriptionId: "92a6e030fe9ed2e189760h"
    },
    2: {
      id: 2,
      content: "Frustrated with some technical issues, but still making progress.",
      mood: 4, // Anxious
      timestamp: new Date('2025-03-16T09:15:00').getTime(), // Use proper date
      owner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      inscriptionId: null
    },
    3: {
      id: 3,
      content: "Excited about the potential of this project! Bitcoin Ordinals for mood tracking could be really useful.",
      mood: 5, // Excited
      timestamp: new Date('2025-03-17T11:45:00').getTime(), // Use proper date
      owner: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      inscriptionId: "83bc2e53a9b17fd42891t"
    }
  };
  
  return mockEntries[entryId] || null;
};

// Get user entry IDs
export const getUserEntryIds = async (userAddress) => {
  // Return mock entry IDs
  return [1, 2, 3];
};

// Get all entries for a user
export const getUserEntries = async (userAddress) => {
  try {
    // For demo purposes, use static entry IDs
    const entryIds = await getUserEntryIds(userAddress);
    
    // Then fetch each entry
    const entriesPromises = entryIds.map(id => getEntry(id));
    const entries = await Promise.all(entriesPromises);
    
    // Filter out any null entries and sort by timestamp (newest first)
    return entries
      .filter(entry => entry !== null)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching user entries:', error);
    return [];
  }
};

// Get mood name from ID
export const getMoodName = (moodId) => {
  const moods = {
    1: 'Happy',
    2: 'Sad',
    3: 'Neutral',
    4: 'Anxious',
    5: 'Excited'
  };
  
  return moods[moodId] || 'Unknown';
};

// Get mood emoji from ID
export const getMoodEmoji = (moodId) => {
  const emojis = {
    1: '😊',
    2: '😔',
    3: '😐',
    4: '😰',
    5: '🤩'
  };
  
  return emojis[moodId] || '❓';
};