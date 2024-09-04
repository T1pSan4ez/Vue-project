import { auth, db, storage } from "@/main.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUserStore } from "@/store/UserStore.js";
import Constants from '@/Constants.js';

export const AuthService = {
    async login(email, password) {
        const response = await signInWithEmailAndPassword(auth, email, password);
        const user = response.user;
        const store = useUserStore();
        store.setUser(user);
        return user;
    },

    async register(email, password, nickname) {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        const user = response.user;
        await setDoc(doc(db, Constants.COLLECTION_USERS, user.uid), {
            [Constants.FIELD_EMAIL]: email,
            [Constants.FIELD_NICKNAME]: nickname,
            [Constants.FIELD_AVATAR_URL]: Constants.DEFAULT_AVATAR
        });
        const store = useUserStore();
        store.setUser(user);
        return user;
    },

    async getUserProfile(uid) {
        const userDoc = await getDoc(doc(db, Constants.COLLECTION_USERS, uid));
        return userDoc.exists() ? userDoc.data() : null;
    },

    async updateNickname(uid, nickname) {
        await updateDoc(doc(db, Constants.COLLECTION_USERS, uid), {
            [Constants.FIELD_NICKNAME]: nickname,
        });
    },

    async changePassword(currentPassword, newPassword) {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
    },

    async uploadAvatar(uid, file) {
        if (!file) return;
        try {
            const storageRef = ref(storage, `avatars/${uid}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(doc(db, Constants.COLLECTION_USERS, uid), {
                [Constants.FIELD_AVATAR_URL]: downloadURL
            });
            return downloadURL;
        } catch (error) {
            console.error("Ошибка при загрузке аватара:", error);
            throw error;
        }
    }
};
