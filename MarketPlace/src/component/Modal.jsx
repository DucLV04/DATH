import React from "react";
function Modal() {
  return (
    <div
      class="modal"
      id="loadingModal"
      tabindex="-1"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-center p-4">
          <div class="modal-body">
            <div class="spinner-border text-primary mb-3" role="status"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Modal;
