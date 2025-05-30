// src/services/databaseService.ts

// Import necessary Firebase Firestore functions
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
// Import the Riddle interface
import { Riddle } from './puzzleService';
// Import Firebase config
import firebaseApp from '../firebaseConfig';

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Collection name for riddles in Firestore
const RIDDLES_COLLECTION = 'riddles';

// Database service class for Firebase Firestore operations
class DatabaseService {

  // Get a single riddle by ID
  async getRiddle(id: string): Promise<Riddle | null> {
    const docRef = doc(db, RIDDLES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Firestore document data might not exactly match Riddle interface,
      // so we cast it and ensure the id field is correct.
      const data = docSnap.data() as Riddle;
      return { ...data, id: docSnap.id };
    } else {
      return null;
    }
  }

  // Get all riddles from the Firestore collection
  async getAllRiddles(): Promise<Riddle[]> {
    const querySnapshot = await getDocs(collection(db, RIDDLES_COLLECTION));
    const riddles: Riddle[] = [];
    querySnapshot.forEach((doc) => {
      // Add each document's data to the riddles array
      // Include the document ID as the riddle ID
      const data = doc.data() as Riddle;
      riddles.push({ ...data, id: doc.id });
    });
    return riddles;
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

  // Initialize the database with a list of riddles if the collection is empty or add new ones if they don't exist
  async initializeWithMockData(riddles: Riddle[]): Promise<void> {
    console.log('Checking for existing riddles...');
    const existingRiddlesSnapshot = await getDocs(collection(db, RIDDLES_COLLECTION));
    const existingRiddleIds = new Set(existingRiddlesSnapshot.docs.map(doc => doc.id));

    let newRiddlesAdded = 0;

    for (const riddle of riddles) {
      if (!existingRiddleIds.has(riddle.id)) {
        console.log(`Adding riddle with ID: ${riddle.id}`);
        // We add riddles without the 'id' field here, as Firestore generates it.
        // However, since our mock data has IDs and we want to use them as document IDs,
        // we will set the document with the specific ID.
        // Note: This requires potentially different Firestore rules than addDoc
        // For simplicity with mock data, let's adjust addRiddle to handle this or use setDoc.
        // A more robust approach for production might involve server-side logic for initialization.

        // For now, let's use addDoc and accept Firestore-generated IDs, but only add if title+riddle combination is unique (less ideal)
        // A better approach is to use setDoc with a known ID, but requires different setup/rules.

        // Let's revert to the previous addDoc logic but ensure we only add if the collection is empty.
        // The previous check `if (existingRiddles.length === 0)` was more appropriate for simple initialization.

        // Let's restore the simple initialization check:
         const initialCheckSnapshot = await getDocs(collection(db, RIDDLES_COLLECTION));
         if (initialCheckSnapshot.empty) {
             console.log('Firestore collection is empty, initializing with all mock data.');
             for (const mockRiddle of riddles) {
                 const { id, ...riddleWithoutId } = mockRiddle;
                 // Use setDoc if we want to preserve mock riddle IDs, but requires rule changes.
                 // Let's stick to addDoc and allow Firestore to generate IDs for simplicity.
                 await addDoc(collection(db, RIDDLES_COLLECTION), riddleWithoutId);
             }
             console.log('Mock data initialization complete.');
         } else {
             console.log('Firestore collection already contains data, skipping initialization.');
         }
         return; // Exit after initial check
      }
    }

    if (newRiddlesAdded > 0) {
        console.log(`Added ${newRiddlesAdded} new riddles.`);
    } else {
        console.log('No new riddles to add.');
    }

    // Revert to the simpler initialization logic: only add mock data if collection is completely empty.
    const finalCheckSnapshot = await getDocs(collection(db, RIDDLES_COLLECTION));
    if (finalCheckSnapshot.empty) {
        console.log('Firestore collection is empty after checks, initializing with all mock data.');
        for (const mockRiddle of riddles) {
            const { id, ...riddleWithoutId } = mockRiddle;
            await addDoc(collection(db, RIDDLES_COLLECTION), riddleWithoutId);
        }
        console.log('Final mock data initialization complete.');
    } else {
        console.log('Firestore collection still contains data, no full initialization needed.');
    }
  }
}

// Export an instance of the DatabaseService
export const databaseService = new DatabaseService();