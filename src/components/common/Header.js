import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">자유게시판</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">홈</Nav.Link>
            {currentUser && (
              <Nav.Link as={Link} to="/write">글쓰기</Nav.Link>
            )}
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/profile">{currentUser.displayName || currentUser.email}</Nav.Link>
                <Button variant="outline-light" onClick={handleLogout}>로그아웃</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                <Nav.Link as={Link} to="/register">회원가입</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;