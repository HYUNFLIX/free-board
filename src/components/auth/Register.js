import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      return setError("비밀번호가 일치하지 않습니다.");
    }
    
    try {
      setError("");
      setLoading(true);
      await register(email, password, displayName);
      navigate("/");
    } catch (error) {
      setError("계정 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Card className="w-100" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">회원가입</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="displayName" className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="email" className="mb-3">
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="password" className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group id="password-confirm" className="mb-3">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              회원가입
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Register;