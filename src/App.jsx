// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";

const Navbar = () => {
  const { session, profile, signOut } = useAuth();

  return (
    <nav style={{ display: "flex", gap: "10px", padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link>
      {session ? (
        <>
          <span>Logged in as {profile?.username}</span>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <>
          <Link to="/signin"><button>Sign In</button></Link>
          <Link to="/signup"><button>Sign Up</button></Link>
        </>
      )}
      {session && <Link to="/profile">Profile</Link>}
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/" element={<h1>Welcome Home</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
