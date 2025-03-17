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
      try {
        const commentsData = await getCommentsByBoardId(boardId);
        setComments(commentsData);
      } catch (error) {
        setError("댓글을 불러오는데 실패했습니다.");
        console.error("Error fetching comments:", error);
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
        setError("댓글 삭제에 실패했습니다.");
        console.error("Error deleting comment:", error);
      }
    }
  };

  if (loading) {
    return <p>댓글 로딩 중...</p>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="mb-4">
      <h4>댓글 {comments.length}개</h4>
      {comments.length === 0 ? (
        <p>첫 번째 댓글을 작성해보세요!</p>
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