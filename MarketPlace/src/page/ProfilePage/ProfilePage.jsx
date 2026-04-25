import React, { useEffect, useState } from "react";
import Header from "../../component/Header";
import ProfileCard from "./ProfileCard/ProfileCard";
import ProfileAction from "./ProfileAction/ProfileAction";
import { getProfile } from "../../services/profileService";
import { useLocation } from "react-router-dom";
import Notification from "../../component/Notification";
function ProfilePage() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);4
  async function getProfileUser() {
    try {
      const data = await getProfile();
      setUser(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getProfileUser();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <div className="container-profile position-relative">
        <ProfileCard user={user} />
        <ProfileAction user={user} />
      </div>
    </div>
  );
}
export default ProfilePage;
