rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 접근 가능
    match /boards/{boardId} {
      // 모든 사용자가 게시글 읽기 가능
      allow read;
      // 인증된 사용자만 게시글 작성 가능
      allow create: if request.auth != null;
      // 작성자만 게시글 수정/삭제 가능
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /comments/{commentId} {
      // 모든 사용자가 댓글 읽기 가능
      allow read;
      // 인증된 사용자만 댓글 작성 가능
      allow create: if request.auth != null;
      // 작성자만 댓글 삭제 가능
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}