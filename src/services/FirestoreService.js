import { db } from '@/main.js';
import { collection, doc, getDoc, setDoc, addDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore'

class FirestoreService {
    async getDocument(collectionName, docId) {
        const docRef = doc(db, collectionName, docId);
        const docSnapshot = await getDoc(docRef);
        return docSnapshot.exists() ? docSnapshot.data() : null;
    }

    async setDocument(collectionName, docId, data) {
        const docRef = doc(db, collectionName, docId);
        await setDoc(docRef, data);
    }

    async addDocument(collectionName, data) {
        await addDoc(collection(db, collectionName), data);
    }

    async deleteDocument(collectionName, docId) {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
    }

    onCollectionSnapshot(collectionName, constraints, callback) {
        const q = query(collection(db, collectionName), ...constraints);
        return onSnapshot(q, callback);
    }

    async getGenres() {
        try {
            const docRef = doc(db, 'config', '7EHRc92wX1ww8XH37ZWQ');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data().genre;
            } else {
                console.error('Документ genres не найден');
                return [];
            }
        } catch (error) {
            console.error('Ошибка при получении жанров:', error);
            return [];
        }
    }
}

export default new FirestoreService();
