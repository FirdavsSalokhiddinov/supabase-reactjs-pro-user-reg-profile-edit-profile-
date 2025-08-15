// src/pages/UserProfile.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, profile } = useAuth();

  if (!profile) return <p>Loading...</p>;

  const isOwner = user?.id === profile.user_id;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{profile.username}'s Profile</h2>
      <img 
        src={profile.pfp_url || "/default.png"} 
        alt="Profile" 
        width={150} 
        style={{ borderRadius: "50%" }} 
      />

      <h3>Basic Info</h3>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>First Name:</strong> {profile.first_name || "-"}</p>
      <p><strong>Last Name:</strong> {profile.last_name || "-"}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Bio:</strong> {profile.bio || "-"}</p>
      <p><strong>Gender:</strong> {profile.gender || "-"}</p>
      <p><strong>Birthdate:</strong> {profile.birthdate || "-"}</p>
      <p><strong>Nationality:</strong> {profile.nationality || "-"}</p>
      <p><strong>Languages:</strong> {profile.languages?.join(", ") || "-"}</p>
      <p><strong>Phone Number:</strong> {profile.phone_number || "-"}</p>
      <p><strong>City:</strong> {profile.location_city || "-"}</p>
      <p><strong>Coordinates:</strong> {profile.location_coordinates ? JSON.stringify(profile.location_coordinates) : "-"}</p>
      <p><strong>Preferred Currency:</strong> {profile.preferred_currency || "-"}</p>
      <p><strong>Arrival Date:</strong> {profile.arrival_date || "-"}</p>
      <p><strong>Plan:</strong> {profile.plan || "-"}</p>
      <p><strong>Plan Start:</strong> {profile.plan_start_date || "-"}</p>
      <p><strong>Plan End:</strong> {profile.plan_end_date || "-"}</p>
      <p><strong>Status:</strong> {profile.status || "-"}</p>
      <p><strong>Role:</strong> {profile.role || "-"}</p>
      <p><strong>Verified:</strong> {profile.is_verified ? "Yes" : "No"}</p>
      <p><strong>Created At:</strong> {profile.created_at}</p>
      <p><strong>Updated At:</strong> {profile.updated_at || "-"}</p>

      {isOwner && (
        <Link to="/edit-profile">
          <button style={{ marginTop: "20px" }}>Edit Profile</button>
        </Link>
      )}
    </div>
  );
};

export default UserProfile;
