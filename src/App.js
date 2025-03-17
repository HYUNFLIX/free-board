import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/auth/Profile";
import BoardList from "./components/board/BoardList";
import BoardView from "./components/board/BoardView";
import BoardWrite from "./components/board/BoardWrite";
import BoardEdit from "./components/board/BoardEdit";
import PrivateRoute from "./components/common/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="container flex-grow-1 py-4">
            <Routes>
              <Route path="/" element={<BoardList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/board/:id" element={<BoardView />} />
              <Route path="/write" element={
                <PrivateRoute>
                  <BoardWrite />
                </PrivateRoute>
              } />
              <Route path="/edit/:id" element={
                <PrivateRoute>
                  <BoardEdit />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;