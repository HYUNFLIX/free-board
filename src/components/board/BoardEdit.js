import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getBoardById, updateBoard } from "../../services/boardService";
import { useAuth } from "../../contexts/AuthContext";

function BoardEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const board = await getBoardById(id);
        
        // 작성자만 수정 가능
        if (board.userId !== currentUser.uid) {
          navigate(`/board/${id}`);
          return;
        }
        
        setTitle(board.title);
        setContent(board.content);
      } catch (error) {
        setError("게시글을 불러오는데 실패했습니다.");
        console.error("Error fetching board:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return setError("제목과 내용을 모두 입력해주세요.");
    }
    
    try {
      setLoading(true);
      const boardData = {
        title,
        content
      };
      
      await updateBoard(id, boardData);
      navigate(`/board/${id}`);
    } catch (error) {
      setError("게시글 수정에 실패했습니다.");
      console.error("Error updating board:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div>
      <h2>게시글 수정</h2>
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
              <Button variant="secondary" onClick={() => navigate(`/board/${id}`)}>
                취소
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                수정완료
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default BoardEdit;