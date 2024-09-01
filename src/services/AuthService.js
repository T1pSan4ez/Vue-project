import { auth, db } from "@/main.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useUserStore } from "@/store/UserStore.js";

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
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            nickname: nickname,
        });
        const store = useUserStore();
        store.setUser(user);
        return user;
    },

    async getUserProfile(uid) {
        const userDoc = await getDoc(doc(db, "users", uid));
        return userDoc.exists() ? userDoc.data() : null;
    },

    async updateNickname(uid, nickname) {
        await updateDoc(doc(db, "users", uid), {
            nickname: nickname,
        });
    },

    async changePassword(currentPassword, newPassword) {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
    },
};
