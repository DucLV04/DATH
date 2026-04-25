import React from "react";
import Avatar from "./Avatar";
import Information from "./Information";
import FollowAndRating from "./FollowAndRating";
function ProfileCard(props) {
  const user=props.user;
  return (
    <div className="profile-card">
      <Avatar avatar={user.avatar_url} username={user.username}/>
      <Information user={user}/>
      <FollowAndRating user={user}/>
    </div>
  );
}
export default ProfileCard;
