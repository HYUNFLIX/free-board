import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { createComment } from "../../services/commentService";
import { useAuth } from "../../contexts/AuthContext";

function CommentWrite({ boardId }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return setError("댓글 내용을 입력해주세요.");
    }
    
    try {
      setLoading(true);
      const commentData = {
        content
      };
      
      await createComment(
        boardId,
        commentData,
        currentUser.uid,
        currentUser.displayName || currentUser.email
      );
      
      setContent("");
      // 댓글이 추가되면 페이지를 새로고침하여 댓글 목록 업데이트
      window.location.reload();
    } catch (error) {
      setError("댓글 작성에 실패했습니다.");
      console.error("Error writing comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <h4>댓글 작성</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="댓글을 작성해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit" disabled={loading}>
            댓글 작성
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CommentWrite;