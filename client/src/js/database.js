// Import the 'openDB' function from the 'idb' package
import { openDB } from 'idb';

// Initialize the database
const initdb = async () =>
  openDB('jate', 1, {
    // Upgrade function to create the object store if it doesn't exist
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      // Create a new object store with auto-incrementing keys
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Function to put (add/update) data in the database
export const putDb = async (content) => {
  console.log('PUT to the database');
  // Open the database
  const jateDb = await openDB('jate', 1);
  // Start a new transaction with readwrite access
  const tx = jateDb.transaction('jate', 'readwrite');
  // Access the 'jate' object store
  const store = tx.objectStore('jate');
  // Put the content into the object store with a fixed id of 1
  const request = store.put({ id: 1, value: content });
  // Wait for the request to complete
  const result = await request;
  console.log('Data saved to the database', result.value);
};

// Function to get (retrieve) data from the database
export const getDb = async () => {
  console.log('GET from the database');
  // Open the database
  const jateDb = await openDB('jate', 1);
  // Start a new transaction with readonly access
  const tx = jateDb.transaction('jate', 'readonly');
  // Access the 'jate' object store
  const store = tx.objectStore('jate');
  // Get all entries from the object store
  const request = store.getAll();
  // Wait for the request to complete
  const result = await request;
  // Log the result or indicate that data was not found
  result
    ? console.log('Data retrieved from the database', result.value)
    : console.log('Data not found in the database');
  // Return the retrieved data, or undefined if not found
  return result?.value;
};

// Call the initdb function to initialize the database when the module is loaded
initdb();
