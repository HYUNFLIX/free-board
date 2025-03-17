import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase 구성 정보
// 실제 구현 시 이 정보는 환경 변수로 관리하는 것이 좋습니다
const firebaseConfig = {
  apiKey: "AIzaSyAg01ZUcRLBpoWHXMJEWPGR-zdAhpEzTDg",
  authDomain: "free-board-6ae8b.firebaseapp.com",
  projectId: "free-board-6ae8b",
  storageBucket: "free-board-6ae8b.firebasestorage.app",
  messagingSenderId: "516035245965",
  appId: "1:516035245965:web:1beaaf9b98cbf2676e6fc4",
  measurementId: "G-17Q53T6R7Y"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 서비스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;