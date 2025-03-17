import React, { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getBoards } from "../../services/boardService";
import { useAuth } from "../../contexts/AuthContext";

function BoardList() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const { currentUser } = useAuth();

  // 게시글 필터링 및 정렬 함수
  const processedBoards = boards
    .filter(board => 
      board.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      board.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return b.createdAt - a.createdAt;
        case "views":
          return b.views - a.views;
        case "oldest":
          return a.createdAt - b.createdAt;
        default:
          return 0;
      }
    });

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
        <h2>커뮤니티 게시판</h2>
        {currentUser && (
          <Link to="/write">
            <Button variant="primary">새 글 작성</Button>
          </Link>
        )}
      </div>

      {/* 검색 및 정렬 섹션 */}
      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-50">
          <Form.Control
            placeholder="제목 또는 작성자로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        <DropdownButton 
          title={
            sortBy === "latest" ? "최신순" : 
            sortBy === "views" ? "조회순" : 
            "오래된 순"
          } 
          variant="outline-secondary"
        >
          <Dropdown.Item onClick={() => setSortBy("latest")}>최신순</Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("views")}>조회순</Dropdown.Item>
          <Dropdown.Item onClick={() => setSortBy("oldest")}>오래된 순</Dropdown.Item>
        </DropdownButton>
      </div>

      {loading ? (
        <p>게시글을 불러오는 중...</p>
      ) : processedBoards.length > 0 ? (
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
            {processedBoards.map((board, index) => (
              <tr key={board.id}>
                <td>{processedBoards.length - index}</td>
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
        <div className="text-center py-5">
          <p className="mb-3">아직 작성된 게시글이 없습니다.</p>
          {currentUser && (
            <Link to="/write" className="btn btn-primary">
              첫 번째 게시글을 작성해보세요!
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default BoardList;
