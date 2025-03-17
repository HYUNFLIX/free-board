import React, { useEffect, useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBoardById, deleteBoard } from "../../services/boardService";
import { useAuth } from "../../contexts/AuthContext";
import CommentList from "../comment/CommentList";
import CommentWrite from "../comment/CommentWrite";

function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const boardData = await getBoardById(id);
        setBoard(boardData);
      } catch (error) {
        setError("게시글을 불러오는데 실패했습니다.");
        console.error("Error fetching board:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deleteBoard(id);
        navigate("/");
      } catch (error) {
        setError("게시글 삭제에 실패했습니다.");
        console.error("Error deleting board:", error);
      }
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!board) {
    return <Alert variant="warning">게시글을 찾을 수 없습니다.</Alert>;
  }

  const isAuthor = currentUser && board.userId === currentUser.uid;

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h3>{board.title}</h3>
            <div>
              <Link to="/" className="btn btn-secondary me-2">목록</Link>
              {isAuthor && (
                <>
                  <Link to={`/edit/${id}`} className="btn btn-warning me-2">수정</Link>
                  <Button variant="danger" onClick={handleDelete}>삭제</Button>
                </>
              )}
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-3 d-flex justify-content-between text-muted">
            <div>
              <small>작성자: {board.author}</small>
            </div>
            <div>
              <small>작성일: {board.createdAt.toLocaleString()} | 조회수: {board.views}</small>
            </div>
          </div>
          <Card.Text className="board-content" style={{ whiteSpace: "pre-wrap", minHeight: "200px" }}>
            {board.content}
          </Card.Text>
        </Card.Body>
      </Card>

      <CommentList boardId={id} />
      {currentUser && <CommentWrite boardId={id} />}
    </div>
  );
}

export default BoardView;