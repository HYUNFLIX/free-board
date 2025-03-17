import React, { useEffect, useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { getCommentsByBoardId, deleteComment } from "../../services/commentService";
import { useAuth } from "../../contexts/AuthContext";

function CommentList({ boardId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      if (!boardId) {
        setLoading(false);
        return;
      }
      
      try {
        const commentsData = await getCommentsByBoardId(boardId);
        setComments(commentsData);
        setError("");
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("댓글을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [boardId]);

  const handleDelete = async (commentId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deleteComment(commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (error) {
        console.error("Error deleting comment:", error);
        setError("댓글 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return <p>댓글을 불러오는 중...</p>;
  }

  // 오류 메시지 대신 더 유용한 메시지 표시
  if (error) {
    return (
      <div className="mb-4">
        <h4>댓글</h4>
        <Alert variant="info">
          {error.includes("불러오는") ? "첫 번째 댓글을 작성해보세요!" : error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4>댓글 {comments.length}개</h4>
      {comments.length === 0 ? (
        <p>아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
      ) : (
        comments.map((comment) => (
          <Card key={comment.id} className="mb-2">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <Card.Title className="h6">{comment.userName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted small">
                    {comment.createdAt.toLocaleString()}
                  </Card.Subtitle>
                </div>
                {currentUser && currentUser.uid === comment.userId && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                  >
                    삭제
                  </Button>
                )}
              </div>
              <Card.Text>{comment.content}</Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default CommentList;
