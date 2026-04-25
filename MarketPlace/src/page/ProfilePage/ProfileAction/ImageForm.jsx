import React, { useRef, useState } from "react";
function ImageForm(props) {
  const inputRef = useRef(null);
  const [previews, setPreview] = useState([]);
  const [files, setFiles] = useState([]);
  function openFileDialog() {
    if (inputRef.current) inputRef.current.click();
  }
  function handleFile(e) {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;
    const validImages = [];
    const newPreviews = [];
    selected.forEach((f) => {
      if (f.type && f.type.startsWith("image/")) {
        validImages.push(f);
        newPreviews.push({ url: URL.createObjectURL(f), name: f.name });
      }
    });
    if (!validImages.length) {
      const newMessage={"image":"Vui lòng chọn file ảnh"}
      props.setMessage(prev=>({...prev,...newMessage}))
    }
    setPreview(newPreviews);
    setFiles(validImages);
    props.onUpload(validImages);
  }
  function removeImage(index, e) {
    e.stopPropagation();
    const newFiles = [...files];
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].url);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreview(newPreviews);
    props.onUpload(newFiles);
  }
  return (
    <div className="img-form" onClick={openFileDialog}>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="d-none"
        onChange={handleFile}
      ></input>
      <div className="d-flex flex-wrap w-100 justify-content-center">
        {previews.length > 0 ? (
          previews.map((p, index) => {
            return (
              <div key={index} className="img-preview-container">
                <img src={p.url} className="img-preview" />
                <div
                  className="remove-img"
                  onClick={(e) => removeImage(index, e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-x-lg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                  </svg>
                </div>
              </div>
            );
          })
        ) : (
          <div className="d-flex flex-column align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: "50px", height: "50px", color: "grey" }}
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.03l5.88-5.879a.75.75 0 011.06 0l5.879 5.88 3.841-3.84a.75.75 0 011.06 0l.94 1.98V6a.75.75 0 00-.75-.75H3.75A.75.75 0 003 6v10.03zM14.25 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
            <span style={{ fontWeight: "500", fontSize: "17px" }}>
              Nhấn đê tải ảnh lên
            </span>
            <span style={{ opacity: "0.5", fontSize: "14px" }}>
              PNJ, JPG hoặc WEBP
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default ImageForm;
