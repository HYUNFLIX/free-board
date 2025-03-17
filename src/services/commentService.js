import { 
  collection, 
  addDoc, 
  doc, 
  getDocs, 
  deleteDoc, 
  query,
  orderBy,
  Timestamp,
  where
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "comments";

// 댓글 작성
export const createComment = async (boardId, commentData, userId, userName) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      boardId,
      ...commentData,
      userId,
      userName,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating comment: ", error);
    throw error;
  }
};

// 게시글별 댓글 조회
export const getCommentsByBoardId = async (boardId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("boardId", "==", boardId),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    
    // 댓글이 없는 경우 빈 배열 반환
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
  } catch (error) {
    console.error("Error getting comments: ", error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error("Error deleting comment: ", error);
    throw error;
  }
};
