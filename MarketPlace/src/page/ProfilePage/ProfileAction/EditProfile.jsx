import React from "react";
import { useState } from "react";
import ImageForm from "./ImageForm";
import { updateProfile } from "../../../services/profileService";
import { useNavigate } from "react-router-dom";
function EditProfile(props) {
  const userInfo = props.user;
  const navigate=useNavigate();
  const [username, setName] = useState(userInfo.username);
  const [avatar, setAvatar] = useState([]);
  const [message, setMessage] = useState({
    username: "",
    image: "",
  });
  async function updateMyInfo(e) {
    e.preventDefault();

    const msg = {};
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("avatar", avatar[0]);
      await updateProfile(formData);  
      navigate(0);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const listError = err.response.data.errors;
        listError.forEach((error) => {
          msg[error.path] = error.msg;
        });
      }
    }
    setMessage(msg);
  }
  return (
    <div class="modal fade" id="myModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vui lòng nhập thông tin cá nhân</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div className="col-12">
                <label htmlFor="InputNameProduct" className="form-label">
                  Tên người dùng*
                </label>
                <input
                  name="username"
                  type="text"
                  id="InputNameProduct"
                  className="form-control"
                  placeholder="Nhập họ và tên của bạn"
                  style={{ borderRadius: "0.5rem" }}
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                />
                <span style={{ color: "red" }}>{message.username}</span>
              </div>
              <div className="col-12">
                <label
                  style={{
                    fontWeight: "500",
                    marginLeft: "5px",
                    marginBottom: "8px",
                    marginTop: "10px",
                  }}
                >
                  Ảnh đại diện*
                </label>
                <ImageForm onUpload={setAvatar} setMessage={setMessage} />
                <span style={{ color: "red" }}>{message.image}</span>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onClick={(e) => updateMyInfo(e)}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditProfile;
