module.exports = (app) => {
  // [UC01]
  app.use('/api/auth', require('./auth.routes'));
  
  // [UC02 & UC03]
  app.use('/api/products', require('./product.routes'));
  
  // [UC04]
  app.use('/api/cart', require('./cart.routes'));
  app.use('/api/orders', require('./order.routes'));
  app.use('/api/reviews', require('./review.routes'));

  // [UC06]
  app.use('/api/notifications', require('./notification.routes'));

  app.use('/api/follow', require('./follow.routes'));

  app.use('/api/users', require('./user.routes'));
};