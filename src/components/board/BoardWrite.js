import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createBoard } from "../../services/boardService";
import { useAuth } from "../../contexts/AuthContext";

function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return setError("제목과 내용을 모두 입력해주세요.");
    }
    
    try {
      setLoading(true);
      const boardData = {
        title,
        content,
        author: currentUser.displayName || currentUser.email,
      };
      
      const boardId = await createBoard(boardData, currentUser.uid);
      navigate(`/board/${boardId}`);
    } catch (error) {
      setError("게시글 작성에 실패했습니다.");
      console.error("Error writing board:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>게시글 작성</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate("/")}>
                취소
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                작성완료
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BoardWrite;