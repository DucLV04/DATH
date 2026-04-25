import React from "react";
import { API_BASE } from "../../../api/axiosClient";
import { useState } from "react";
import { formatTime } from "../../../utils/utils";
import { parseISO } from "date-fns";
import { SquarePen, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../../../services/productService";
import PopupCancle from "./PopupCancle";
function HeaderPost(props) {
  const [followed, setFollowed] = useState(false);
  const [isCanclePopupOpen, setIsCanclePopupOpen] = useState(false);
  const openCanclePopup = () => setIsCanclePopupOpen(true);
  const closeCanclePopup = () => setIsCanclePopupOpen(false);
  const navigate = useNavigate();
  function handleFollow() {
    setFollowed(!followed);
  }
  const headerInfo = props.headerInfo;
  const author = headerInfo.author;
  const createAt = parseISO(headerInfo.createAt);
  async function deleteProductById() {
    try {
      await deleteProduct(props.idProduct);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="info-seller">
      <div
        className="d-flex align-items-center gap-2"
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (author.id) {
            navigate(`/shop/${author.id}`);
          }
        }}
      >
        <span className="avt-mini">
          {author.avatar === "" ? (
            author.name[0]
          ) : (
            <img src={`${API_BASE}${author.avatar}`} alt="avatar" />
          )}
        </span>
        <div className="name-seller">
          <span style={{ fontSize: "1.1rem", fontWeight: "600" }}>{author.name}</span>
          <span style={{ fontSize: "0.9rem", opacity: "0.5" }}>
            {headerInfo.updateAt === ""
              ? formatTime(createAt)
              : `Đã chỉnh sửa ${formatTime(parseISO(headerInfo.updateAt))}`}
          </span>
        </div>
      </div>
      {props.showAction && (
        <div
          className="d-flex justify-content-between gap-3"
          style={{ marginLeft: "auto", opacity: "0.5 " }}
        >
          <SquarePen
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/edit", {
                state: {
                  id: props.idProduct,
                },
              });
            }}
          />
          <Trash
            size={20}
            style={{ cursor: "pointer" }}
            onClick={openCanclePopup}
          />
        </div>
      )}
      <PopupCancle
        isOpen={isCanclePopupOpen}
        onClose={closeCanclePopup}
        onDelete={deleteProductById}
        onShowNotifi={props.openNotifi}
      />
    </div>
  );
}
export default HeaderPost;
