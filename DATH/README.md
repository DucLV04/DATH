# ============================================
# AUTH APIs
# ============================================

# Register
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"newuser\",\"email\":\"newuser@example.com\",\"password\":\"Pass@1234\"}'

# Login
curl -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"testuser@example.com\",\"password\":\"123456\"}'

# Verify Email
curl "http://localhost:8080/api/auth/verify?token=your_verification_token"

# Forgot Password
curl -X POST http://localhost:8080/api/auth/forgot-password `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"testuser@example.com\"}'

# Reset Password
curl -X POST http://localhost:8080/api/auth/reset-password `
  -H "Content-Type: application/json" `
  -d '{\"token\":\"reset_token_here\",\"password\":\"NewPass@1234\"}'

# Logout (requires token)
curl -X POST http://localhost:8080/api/auth/logout `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8"

# ============================================
# PRODUCT APIs
# ============================================

# Create Product (requires token)
curl -X POST http://localhost:8080/api/products `
  -H "Content-Type: application/json" `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8" `
  -d '{\"name\":\"Gaming Laptop\",\"description\":\"High performance laptop\",\"price\":\"1299.99\",\"stock\":5,\"category\":\"electronics\"}'

# Get All Products
curl "http://localhost:8080/api/products?search=laptop&category=electronics&page=1&limit=10"

# Get All Products
curl http://localhost:8080/api/products

# Get Product By ID
curl http://localhost:8080/api/products/1

# Update Product
curl -X PUT http://localhost:8080/api/products/1 `
  -H "Content-Type: application/json" `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8" `
  -d '{\"name\":\"Updated Laptop\",\"description\":\"New description\",\"price\":\"1199.99\",\"stock\":10,\"category\":\"electronics\"}'

# Delete Product
curl -X DELETE http://localhost:8080/api/products/1 `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8"

# ============================================
# CART APIs
# ============================================

# Get Cart
curl http://localhost:8080/api/cart `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8"

# Add to Cart
curl -X POST http://localhost:8080/api/cart `
  -H "Content-Type: application/json" `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8" `
  -d '{\"productId\":1,\"quantity\":2}'

# Update Cart Item Quantity
curl -X PUT http://localhost:8080/api/cart/1 `
  -H "Content-Type: application/json" `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8" `
  -d '{\"quantity\":3}'

# Remove from Cart
curl -X DELETE http://localhost:8080/api/cart/1 `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8"

# ============================================
# ORDER APIs
# ============================================

# Place Order
curl -X POST http://localhost:8080/api/orders `
  -H "Content-Type: application/json" `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8" `
  -d '{\"phone\":\"0123456789\",\"address\":\"123 Main Street, District 1, Ho Chi Minh City\",\"paymentMethod\":\"COD\",\"note\":\"Please deliver in the morning\"}'

# Get Order History
curl -X GET http://localhost:8080/api/orders `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8"


# ============================================
# NOTIFICATION APIs
# ============================================

# Get All Notifications
curl http://localhost:8080/api/notifications `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8"

# Mark Single Notification as Read
curl -X PUT http://localhost:8080/api/notifications/1/read `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8"

# Mark All Notifications as Read
curl -X PUT http://localhost:8080/api/notifications/read-all `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8"

# ============================================
# REVIEW APIs
# ============================================

# Get All Reviews for a Product
curl http://localhost:8080/api/reviews/1

# Submit a New Review
curl -X POST http://localhost:8080/api/reviews `
  -H "Content-Type: application/json" `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8" `
  -d '{\"productId\":1,\"orderItemId\":1,\"rating\":5,\"comment\":\"Great product, highly recommended!\"}'

# Submit a Reply to a Review
curl -X POST http://localhost:8080/api/reviews/1/reply `
  -H "Content-Type: application/json" `
  -H "x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYzMTE1NTQzLCJleHAiOjE3NjMyMDE5NDN9.-jON9whQsm2BOeY3TUNArKR0FqWsMilgkXE902R8Vi8" `
  -d '{\"comment\":\"Thank you for your feedback!\"}'