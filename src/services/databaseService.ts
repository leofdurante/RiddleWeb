// src/services/databaseService.ts

// Import necessary Firebase Firestore functions
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
// Import the Riddle interface
import { Riddle } from './puzzleService';
// Import Firebase config
import firebaseApp from '../firebaseConfig';

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Collection name for riddles in Firestore
const RIDDLES_COLLECTION = 'riddles';

// Test function to check Firestore connection
export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    const testCollection = collection(db, 'test');
    const testSnapshot = await getDocs(testCollection);
    console.log('Firestore connection successful, test collection size:', testSnapshot.size);
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    return false;
  }
};

// Function to clear all riddles from the database
export const clearAllRiddles = async () => {
  try {
    console.log('Clearing all riddles from database...');
    const querySnapshot = await getDocs(collection(db, RIDDLES_COLLECTION));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('All riddles cleared from database');
  } catch (error) {
    console.error('Error clearing riddles:', error);
    throw error;
  }
};

// Database service class for Firebase Firestore operations
class DatabaseService {

  // Get a single riddle by ID
  async getRiddle(id: string): Promise<Riddle | null> {
    try {
      console.log('Getting riddle with ID:', id);
      const docRef = doc(db, RIDDLES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Firestore document data might not exactly match Riddle interface,
        // so we cast it and ensure the id field is correct.
        const data = docSnap.data() as Riddle;
        const riddle = { ...data, id: docSnap.id };
        console.log('Riddle found:', riddle);
        return riddle;
      } else {
        console.log('Riddle document does not exist');
        return null;
      }
    } catch (error) {
      console.error('Error getting riddle:', error);
      throw error;
    }
  }

  // Get all riddles from the Firestore collection
  async getAllRiddles(): Promise<Riddle[]> {
    try {
      console.log('Getting all riddles from Firestore...');
      const querySnapshot = await getDocs(collection(db, RIDDLES_COLLECTION));
      console.log('Query snapshot size:', querySnapshot.size);
      const riddles: Riddle[] = [];
      querySnapshot.forEach((doc) => {
        // Add each document's data to the riddles array
        // Include the document ID as the riddle ID
        const data = doc.data() as Riddle;
        const riddle = { ...data, id: doc.id };
        console.log('Document ID:', doc.id, 'Riddle title:', riddle.title);
        riddles.push(riddle);
      });
      console.log('Processed riddles:', riddles);
      return riddles;
    } catch (error) {
      console.error('Error getting riddles from Firestore:', error);
      throw error;
    }
  }

  // Get a random riddle (less efficient with large datasets, but works for mock data)
  async getRandomRiddle(): Promise<Riddle | null> {
    const riddles = await this.getAllRiddles();
    if (riddles.length === 0) return null;
    return riddles[Math.floor(Math.random() * riddles.length)];
  }

  // Add a new riddle to the Firestore collection
  async addRiddle(riddle: Omit<Riddle, 'id'>): Promise<string> {
    // Firestore automatically generates a unique ID when adding a document
    const docRef = await addDoc(collection(db, RIDDLES_COLLECTION), riddle);
    return docRef.id; // Return the generated ID
  }

  // Update an existing riddle by ID
  async updateRiddle(id: string, updates: Partial<Riddle>): Promise<void> {
    const docRef = doc(db, RIDDLES_COLLECTION, id);
    await updateDoc(docRef, updates);
  }

  // Delete a riddle by ID from the Firestore collection
  async deleteRiddle(id: string): Promise<void> {
    const docRef = doc(db, RIDDLES_COLLECTION, id);
    await deleteDoc(docRef);
  }

  // Initialize the database with a list of riddles if the collection is empty
  async initializeWithMockData(riddles: Riddle[]): Promise<void> {
    console.log('Checking for existing riddles...');
    const existingRiddlesSnapshot = await getDocs(collection(db, RIDDLES_COLLECTION));
    
    // Only initialize if the collection is completely empty
    if (existingRiddlesSnapshot.empty) {
      console.log('Firestore collection is empty, initializing with mock data...');
      
      for (const mockRiddle of riddles) {
        try {
          // Use setDoc to preserve the original mock ID
          const { id, ...riddleWithoutId } = mockRiddle;
          await setDoc(doc(db, RIDDLES_COLLECTION, id), riddleWithoutId);
          console.log(`Added riddle: ${mockRiddle.title} with ID: ${id}`);
        } catch (error) {
          console.error(`Failed to add riddle ${mockRiddle.title}:`, error);
        }
      }
      
      console.log('Mock data initialization complete.');
    } else {
      console.log('Firestore collection already contains data, skipping initialization.');
    }
  }
}

// Export an instance of the DatabaseService
export const databaseService = new DatabaseService();