import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getBoards } from "../../services/boardService";
import { useAuth } from "../../contexts/AuthContext";

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsData = await getBoards();
        setBoards(boardsData);
      } catch (error) {
        console.error("Error fetching boards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>게시글 목록</h2>
        {currentUser && (
          <Link to="/write">
            <Button variant="primary">글쓰기</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : boards.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "50%" }}>제목</th>
              <th style={{ width: "15%" }}>작성자</th>
              <th style={{ width: "15%" }}>작성일</th>
              <th style={{ width: "10%" }}>조회수</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((board, index) => (
              <tr key={board.id}>
                <td>{boards.length - index}</td>
                <td>
                  <Link to={`/board/${board.id}`} className="text-decoration-none">
                    {board.title}
                  </Link>
                </td>
                <td>{board.author}</td>
                <td>{board.createdAt.toLocaleDateString()}</td>
                <td>{board.views}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>게시글이 없습니다.</p>
      )}
    </div>
  );
}

export default BoardList;