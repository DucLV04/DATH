# React Frontend Project


## 📌 Giới thiệu

Đây là **React Frontend** của dự án. Ứng dụng được cấu hình để chạy trên **localhost:3000** và **phụ thuộc vào Backend API** để hoạt động đúng.

⚠️ **Lưu ý quan trọng:** Bạn **bắt buộc phải chạy Backend trước** khi khởi động Frontend, nếu không các chức năng gọi API sẽ bị lỗi (500 / 404 / Network Error).

---

## 🛠️ Yêu cầu môi trường

Trước khi chạy project, hãy đảm bảo máy của bạn đã cài đặt:

* **Node.js** (khuyến nghị phiên bản LTS ≥ 16)
* **npm** (đi kèm Node.js)
* Trình duyệt web (Chrome, Edge, Firefox, ...)

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

---

## ⚙️ Cài đặt project

### 1️⃣ Clone source code

```bash
git clone <repository-url>
cd <project-folder>
```

### 2️⃣ Cài đặt dependencies

```bash
npm install
```

Lệnh này sẽ cài toàn bộ thư viện được khai báo trong `package.json`.

---

## ▶️ Chạy ứng dụng Frontend

⚠️ **Hãy chắc chắn Backend đã được khởi động trước bước này.**

Sau khi Backend đã chạy thành công, chạy Frontend bằng lệnh:

```bash
npm start
```

Ứng dụng sẽ được mở tại:

```
http://localhost:3000
```

Nếu trình duyệt không tự mở, bạn có thể truy cập thủ công theo đường link trên.

---

## 🔗 Kết nối Backend

* Frontend gọi API từ Backend (ví dụ: `http://localhost:8080/api` hoặc theo cấu hình của dự án)
* Kiểm tra file cấu hình như:

  * `.env`
  * `axiosClient.js`
  * `config.js`

Ví dụ file `.env`:

```env
REACT_APP_API_URL=http://localhost:8080
```

⚠️ Sau khi thay đổi file `.env`, **cần restart lại Frontend**.

---

## ❗ Các lỗi thường gặp

### ❌ `npm start` nhưng không gọi được API

* Backend chưa chạy
* Sai port Backend
* Sai biến môi trường `.env`

### ❌ `Module not found`

* Chưa chạy `npm install`

### ❌ Lỗi CORS

* Backend chưa cấu hình CORS cho `http://localhost:3000`

---

## 📄 Ghi chú

* Không commit thư mục `node_modules`
* Luôn chạy Backend trước Frontend
* Khi pull code mới, nên chạy lại:

```bash
npm install
```

---

✅ **Frontend chạy tại:** `http://localhost:3000`
✅ **Lệnh chạy:** `npm start`

