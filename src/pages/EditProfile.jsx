// src/pages/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../api/supabase-client";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { session, profile, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  // Load profile data and check ownership
  useEffect(() => {
    if (!session || !profile) {
      navigate("/");
    } else if (session.user.id !== profile.user_id) {
      alert("You are not allowed to edit this profile.");
      navigate("/");
    } else {
      setFormData({ ...profile });
    }
  }, [session, profile, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
const handleUpload = async () => {
  if (!file) return formData.pfp_url || null;

  // Generate a unique filename to prevent browser caching issues
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const filePath = `${profile.user_id}/profile_${timestamp}.${fileExt}`;

  // Delete old image if exists
  if (profile.pfp_url) {
    try {
      const oldPath = profile.pfp_url.split("/").slice(-2).join("/"); // extract user_id/filename
      await supabase.storage.from("pfp").remove([oldPath]);
    } catch (err) {
      console.log("Old image deletion error (maybe file didn't exist):", err.message);
    }
  }

  // Upload new image
  const { error: uploadError } = await supabase.storage.from("pfp").upload(filePath, file);
  if (uploadError) throw uploadError;

  // Get public URL
  const { data, error: urlError } = supabase.storage.from("pfp").getPublicUrl(filePath);
  if (urlError) throw urlError;

  return data?.publicUrl || data?.url || null;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pfp_url = await handleUpload();

      // Update profile table
      await supabase
        .from("profiles")
        .update({ ...formData, pfp_url })
        .eq("user_id", profile.user_id);

      // Refresh context
      await fetchUserProfile(profile.user_id);
      alert("Profile updated!");
      navigate("/profile");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!formData || !profile) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <img
          src={formData.pfp_url || "/default.png"}
          alt="Profile"
          width={150}
          style={{ borderRadius: "50%", marginBottom: "10px" }}
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        {/* Editable fields from profiles table */}
        <input name="first_name" placeholder="First Name" value={formData.first_name || ""} onChange={handleChange} />
        <input name="last_name" placeholder="Last Name" value={formData.last_name || ""} onChange={handleChange} />
        <input name="username" placeholder="Username" value={formData.username || ""} onChange={handleChange} />
        <input name="bio" placeholder="Bio" value={formData.bio || ""} onChange={handleChange} />
        <input name="gender" placeholder="Gender" value={formData.gender || ""} onChange={handleChange} />
        <input name="birthdate" type="date" placeholder="Birthdate" value={formData.birthdate || ""} onChange={handleChange} />
        <input name="nationality" placeholder="Nationality" value={formData.nationality || ""} onChange={handleChange} />
        <input
          name="languages"
          placeholder="Languages (comma separated)"
          value={formData.languages ? formData.languages.join(", ") : ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              languages: e.target.value.split(",").map((s) => s.trim()),
            })
          }
        />
        <input name="phone_number" placeholder="Phone Number" value={formData.phone_number || ""} onChange={handleChange} />
        <input name="location_city" placeholder="City" value={formData.location_city || ""} onChange={handleChange} />
        <input name="preferred_currency" placeholder="Preferred Currency" value={formData.preferred_currency || ""} onChange={handleChange} />
        <input name="arrival_date" type="date" placeholder="Arrival Date" value={formData.arrival_date || ""} onChange={handleChange} />
        <input name="plan" placeholder="Plan" value={formData.plan || ""} onChange={handleChange} />
        <input name="plan_start_date" type="date" placeholder="Plan Start" value={formData.plan_start_date || ""} onChange={handleChange} />
        <input name="plan_end_date" type="date" placeholder="Plan End" value={formData.plan_end_date || ""} onChange={handleChange} />
        <input name="status" placeholder="Status" value={formData.status || ""} onChange={handleChange} />
        <input name="role" placeholder="Role" value={formData.role || ""} onChange={handleChange} />
        <label>
          Verified:
          <input
            type="checkbox"
            name="is_verified"
            checked={formData.is_verified || false}
            onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
          />
        </label>

        <button type="submit" style={{ marginTop: "10px" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
