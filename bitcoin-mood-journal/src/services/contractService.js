import { 
  openContractCall, 
  UserSession, 
  AppConfig 
} from '@stacks/connect';
import { 
  stringUtf8CV, 
  uintCV, 
  cvToValue,
  fetchCallReadOnlyFunction, // Using fetchCallReadOnlyFunction instead of callReadOnlyFunction
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

// Get a specific entry
export const getEntry = async (entryId) => {
  const functionName = 'get-entry';
  const functionArgs = [uintCV(entryId)];
  
  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    senderAddress: userSession.isUserSignedIn() 
      ? userSession.loadUserData().profile.stxAddress.testnet
      : contractAddress,
  };
  
  try {
    // Using fetchCallReadOnlyFunction instead of callReadOnlyFunction
    const result = await fetchCallReadOnlyFunction(options);
    // If no result, return null
    if (!result.value) return null;
    
    // Convert clarity value to JavaScript object
    const entry = cvToValue(result);
    
    return {
      id: entryId,
      content: entry.content,
      mood: entry.mood,
      timestamp: entry.timestamp,
      owner: entry.owner,
      inscriptionId: entry['inscription-id'] ? entry['inscription-id'].value : null
    };
  } catch (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
};

// Get user entry IDs
export const getUserEntryIds = async (userAddress) => {
  const functionName = 'get-user-entry-ids';
  const functionArgs = [principalCV(userAddress)];
  
  const options = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    senderAddress: userSession.isUserSignedIn() 
      ? userSession.loadUserData().profile.stxAddress.testnet
      : contractAddress,
  };
  
  try {
    // Using fetchCallReadOnlyFunction instead of callReadOnlyFunction
    const result = await fetchCallReadOnlyFunction(options);
    const idsObj = cvToValue(result);
    // Extract the list of IDs
    return idsObj['entry-ids'] || [];
  } catch (error) {
    console.error('Error fetching user entry IDs:', error);
    return [];
  }
};

// Get all entries for a user
export const getUserEntries = async (userAddress) => {
  try {
    // First get all entry IDs for the user
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