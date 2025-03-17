import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query,
  orderBy,
  Timestamp,
  where
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "boards";

// 게시글 작성
export const createBoard = async (boardData, userId) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...boardData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      views: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating board: ", error);
    throw error;
  }
};

// 게시글 목록 조회
export const getBoards = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    }));
  } catch (error) {
    console.error("Error getting boards: ", error);
    throw error;
  }
};

// 게시글 상세 조회
export const getBoardById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const boardData = docSnap.data();
      
      // 조회수 증가
      await updateDoc(docRef, {
        views: (boardData.views || 0) + 1
      });
      
      return {
        id: docSnap.id,
        ...boardData,
        views: (boardData.views || 0) + 1,
        createdAt: boardData.createdAt.toDate(),
        updatedAt: boardData.updatedAt.toDate(),
      };
    } else {
      throw new Error("Board not found");
    }
  } catch (error) {
    console.error("Error getting board: ", error);
    throw error;
  }
};

// 게시글 수정
export const updateBoard = async (id, boardData) => {
  try {
    const boardRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(boardRef, {
      ...boardData,
      updatedAt: Timestamp.now()
    });
    return id;
  } catch (error) {
    console.error("Error updating board: ", error);
    throw error;
  }
};

// 게시글 삭제
export const deleteBoard = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Error deleting board: ", error);
    throw error;
  }
};

// 사용자별 게시글 조회
export const getBoardsByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    }));
  } catch (error) {
    console.error("Error getting user's boards: ", error);
    throw error;
  }
};