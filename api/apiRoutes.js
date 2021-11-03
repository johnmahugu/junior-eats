'use strict';

const passport = require("passport");
const requestAuth = passport.authenticate('jwt', { session: false })

module.exports = function(app, db, server) {

    // General routes
    var uploadController = require('./controllers/UploadController');
    app.route('/api/upload')
        .post( (req, res) => { uploadController.uploadToDatabase(req, res, db) })
    app.route('/api/uploadMultimedias')
        .post( (req, res) => { uploadController.uploadMultimediasToDatabase(req, res, db) })

    // Auth routes
    var authController = require('./controllers/AuthController');
    app.route('/api/login')
        .post( (req, res) => { authController.login(req, res, db) })

    app.route('/api/register')
        .post( (req, res) => { authController.register(req, res, db) })

    // Users Routes
    var userController = require('./controllers/UserController');
    app.route('/api/users')
        .get(requestAuth, (req, res) => { userController.list(req, res, db) })

    app.route('/api/user/:userId')
        .get( (req, res) => {userController.fetchUser(req, res, db) })
        .put( (req, res) => {userController.updateUser(req, res, db) })
        .delete((req, res) => { userController.deleteUser(req, res, db) });

    app.route('/api/user/add')
        .post( (req, res) => { userController.createNewUser(req, res, db) })

    //Char routes
    var chatController = require('./controllers/ChatController')
    chatController.initializeUserChat(app, db, server)
    app.route('/api/chat/create')
        .post( (req, res) => { chatController.createChat(req, res, db)})
    app.route('/api/chat/:channel')
        .get( (req, res) => { chatController.getChat(req, res, db) })
        .post( (req, res) => { chatController.addMessage(req, res, db) })

    // Notification Routes
    var notificationController = require('./controllers/NotificationController')
    app.route('/api/notification/pushAll')
        .post(requestAuth, (req, res) => { notificationController.sendPushNotificationToAllUsers(req, res, db) })
    
    // Mail Routes
    var emailController = require('./controllers/EmailController')
    app.route('/api/email/emailAll')
        .post(requestAuth, (req, res) => { emailController.sendEmailToAllUsers(req, res, db) })

    // Templates Routes
    var templateController = require('./controllers/generated/TemplateController')
    app.route('/api/templates')
        .get(requestAuth, (req, res) => { templateController.list(req, res, db) })

    app.route('/api/template/:templateId')
        .get( (req, res) => {templateController.fetchTemplate(req, res, db) })
        .put( (req, res) => {templateController.updateTemplate(req, res, db) })
        .delete((req, res) => { templateController.deleteTemplate(req, res, db) })

    app.route('/api/template/add')
        .post( (req, res) => { templateController.createNewTemplate(req, res, db) })

    // Insert more API routes here

    // Restaurants Routes
    var restaurantController = require('./controllers/generated/RestaurantController')
    app.route('/api/restaurants')
        .get(requestAuth, (req, res) => { restaurantController.list(req, res, db) })

    app.route('/api/restaurant/:restaurantId')
        .get( (req, res) => {restaurantController.fetchRestaurant(req, res, db) })
        .put( (req, res) => {restaurantController.updateRestaurant(req, res, db) })
        .delete((req, res) => { restaurantController.deleteRestaurant(req, res, db) })

    app.route('/api/restaurant/add')
        .post( (req, res) => { restaurantController.createNewRestaurant(req, res, db) })


    // Products Routes
    var productController = require('./controllers/generated/ProductController')
    app.route('/api/products')
        .get(requestAuth, (req, res) => { productController.list(req, res, db) })

    app.route('/api/product/:productId')
        .get( (req, res) => {productController.fetchProduct(req, res, db) })
        .put( (req, res) => {productController.updateProduct(req, res, db) })
        .delete((req, res) => { productController.deleteProduct(req, res, db) })

    app.route('/api/product/add')
        .post( (req, res) => { productController.createNewProduct(req, res, db) })


    // Categorys Routes
    var categoryController = require('./controllers/generated/CategoryController')
    app.route('/api/categories')
        .get(requestAuth, (req, res) => { categoryController.list(req, res, db) })

    app.route('/api/category/:categoryId')
        .get( (req, res) => {categoryController.fetchCategory(req, res, db) })
        .put( (req, res) => {categoryController.updateCategory(req, res, db) })
        .delete((req, res) => { categoryController.deleteCategory(req, res, db) })

    app.route('/api/category/add')
        .post( (req, res) => { categoryController.createNewCategory(req, res, db) })


    // Orders Routes
    var orderController = require('./controllers/generated/OrderController')
    app.route('/api/orders')
        .get(requestAuth, (req, res) => { orderController.list(req, res, db) })

    app.route('/api/order/:orderId')
        .get( (req, res) => {orderController.fetchOrder(req, res, db) })
        .put( (req, res) => {orderController.updateOrder(req, res, db) })
        .delete((req, res) => { orderController.deleteOrder(req, res, db) })

    app.route('/api/order/add')
        .post( (req, res) => { orderController.createNewOrder(req, res, db) })


    // Reviews Routes
    var reviewController = require('./controllers/generated/ReviewController')
    app.route('/api/reviews')
        .get(requestAuth, (req, res) => { reviewController.list(req, res, db) })

    app.route('/api/review/:reviewId')
        .get( (req, res) => {reviewController.fetchReview(req, res, db) })
        .put( (req, res) => {reviewController.updateReview(req, res, db) })
        .delete((req, res) => { reviewController.deleteReview(req, res, db) })

    app.route('/api/review/add')
        .post( (req, res) => { reviewController.createNewReview(req, res, db) })



};
