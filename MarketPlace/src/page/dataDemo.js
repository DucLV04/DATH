const listTrending = [
  {
    hashtag: "#iphone14",
    ranknumber: 1,
    countnumber: 234,
  },
  {
    hashtag: "#fashion",
    ranknumber: 2,
    countnumber: 189,
  },
  {
    hashtag: "#food",
    ranknumber: 3,
    countnumber: 156,
  },
  {
    hashtag: "#vintage",
    ranknumber: 4,
    countnumber: 98,
  },
  {
    hashtag: "#tech",
    ranknumber: 5,
    countnumber: 87,
  },
];
const listRecommendSeller = [
  {
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    name: "TechWorld VN",
    followers: 12500,
  },
  {
    avatar: "",
    name: "Fashion Bouqutie",
    followers: 11000,
  },
  {
    avatar: "",
    name: "Home Decor Plus",
    followers: 8500,
  },
];
const listPosts = [
  {
    author: {
      firstName: "TechWorld",
      lastName: "VN",
      avatar:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    createAt: "2025-09-25T09:32:12.345+07:00",
    updateAt: "",
    title: " iPhone 15 Pro Max 256GB - Chính hãng VN/A",
    content: `iPhone 15 Pro Max mới 100%, nguyên seal, bảo hành 12 tháng chính hãng Apple Việt Nam.

📱 Thông số kỹ thuật:

- Màn hình: 6.7" Super Retina XDR OLED

- Chip: A17 Pro Bionic

- Camera: 48MP chính + 12MP góc siêu rộng + 12MP tele

- Bộ nhớ: 256GB

- Màu sắc: Titan Tự Nhiên

📦 Bao gồm:

- Máy iPhone 15 Pro Max 256GB

- Cáp USB-C to USB-C

- Tài liệu hướng dẫn

- Hộp nguyên seal

🎯 Ưu đãi đặc biệt:

- Miễn phí giao hàng toàn quốc

- Bảo hành 12 tháng chính hãng

- Đổi trả trong 7 ngày nếu có lỗi

- Hỗ trợ trả góp 0% lãi suất`,
    imageURL:
      "https://images.unsplash.com/photo-1661956600686-2f1d8f3b0e6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    product: {
      productName: "iPhone 15 Pro Max",
      hashtag: ["#iphone", "#apple"],
      price: 15000000,
      currencyCode: "VND",
      quantity: 2,
      condition: "Mới",
      stockStatus: "Còn hàng",
      category: "Điện thoại",
    },
    comments: [
      {
        id_user: 1,
        content: "Sản phẩm chất lượng, đáng mua!",
        parentId: null,
        creatAt: "2025-09-27T09:40:12.345+07:00",
        updateAt: "2025-09-27T09:40:12.345+07:00",
      },
      {
        id_user: 1,
        content: "Sản phẩm chất lượng, đáng mua!",
        parentId: null,
        creatAt: "2025-09-27T09:40:12.345+07:00",
        updateAt: "2025-09-27T09:40:12.345+07:00",
      },
      {
        id_user: 1,
        content: "Sản phẩm chất lượng, đáng mua!",
        parentId: null,
        creatAt: "2025-09-27T09:40:12.345+07:00",
        updateAt: "2025-09-27T09:40:12.345+07:00",
      },
      {
        id_user: 1,
        content: "Sản phẩm chất lượng, đáng mua!",
        parentId: null,
        creatAt: "2025-09-27T09:40:12.345+07:00",
        updateAt: "2025-09-27T09:40:12.345+07:00",
      },
    ],
  },
];
export { listTrending, listRecommendSeller, listPosts };
