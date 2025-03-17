import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { getBoardsByUserId } from "../../services/boardService";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser } = useAuth();
  const [userBoards, setUserBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBoards = async () => {
      try {
        if (currentUser) {
          const boards = await getBoardsByUserId(currentUser.uid);
          setUserBoards(boards);
        }
      } catch (error) {
        console.error("Error fetching user boards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBoards();
  }, [currentUser]);

  return (
    <div className="row">
      <div className="col-md-4 mb-4">
        <Card>
          <Card.Body>
            <Card.Title>프로필</Card.Title>
            <Card.Text>
              <strong>이메일:</strong> {currentUser.email}
            </Card.Text>
            <Card.Text>
              <strong>이름:</strong> {currentUser.displayName || "이름 없음"}
            </Card.Text>
            <Card.Text>
              <strong>가입일:</strong> {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-8">
        <Card>
          <Card.Body>
            <Card.Title>내가 작성한 글</Card.Title>
            {loading ? (
              <p>로딩 중...</p>
            ) : userBoards.length > 0 ? (
              <ListGroup variant="flush">
                {userBoards.map((board) => (
                  <ListGroup.Item key={board.id} className="d-flex justify-content-between align-items-center">
                    <Link to={`/board/${board.id}`} className="text-decoration-none">
                      {board.title}
                    </Link>
                    <small className="text-muted">
                      {board.createdAt.toLocaleDateString()}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>작성한 게시글이 없습니다.</p>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Profile;