import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Menu from './Menu'
import { HomePage, NotificationView, EmailView, ChatView } from './pages'


import { UsersListView, UpdateUserView, AddNewUserView, DetailedUserView } from '../generated/users';
import { TemplatesListView, UpdateTemplatesView, AddNewTemplatesView, DetailedTemplatesView } from '../generated/emailTemplates';
// Insert more CRUD imports here
import { RestaurantsListView, UpdateRestaurantsView, AddNewRestaurantsView, DetailedRestaurantsView } from '../generated/restaurants';

import { ProductsListView, UpdateProductsView, AddNewProductsView, DetailedProductsView } from '../generated/products';

import { CategoriesListView, UpdateCategoriesView, AddNewCategoriesView, DetailedCategoriesView } from '../generated/categories';

import { OrdersListView, UpdateOrdersView, AddNewOrdersView, DetailedOrdersView } from '../generated/orders';

import { ReviewsListView, UpdateReviewsView, AddNewReviewsView, DetailedReviewsView } from '../generated/reviews';



import { LogoutView } from '../../onboarding';

function AdminView() {
    return (
          <div className="App">
            <div className="MainMenu">
              <Menu />
            </div>
            <div className="MainPanel">
              <Switch>
                <Route path="/about">
                  <div>About</div>
                </Route>
                <Route path="/admin/sendNotification">
                  <NotificationView />
                </Route>
                <Route path="/admin/sendEmail">
                  <EmailView />
                </Route>
                <Route path="/admin/users">
                  <UsersListView />
                </Route>
                <Route path="/admin/user/:userId/update">
                  <UpdateUserView />
                </Route>
                <Route path="/admin/user/:userId/view">
                  <DetailedUserView />
                </Route>
                <Route path="/admin/user/add">
                  <AddNewUserView />
                </Route>
                <Route path="/admin/chat/:userId">
                  <ChatView />
                </Route>
                <Route path="/admin/templates">
                    <TemplatesListView />
                </Route>
                <Route path="/admin/template/:templateId/update">
                    <UpdateTemplatesView />
                </Route>
                <Route path="/admin/template/:templateId/view">
                    <DetailedTemplatesView />
                </Route>
                <Route path="/admin/template/add" component={(props) => <AddNewTemplatesView  {...props}/>} />
                 {/* Insert more CRUD routes here */}

                <Route path="/admin/restaurants">
                    <RestaurantsListView />
                </Route>
                <Route path="/admin/restaurant/:restaurantId/update">
                    <UpdateRestaurantsView />
                </Route>
                <Route path="/admin/restaurant/:restaurantId/view">
                    <DetailedRestaurantsView />
                </Route>
                <Route path="/admin/restaurant/add">
                    <AddNewRestaurantsView />
                </Route>


                <Route path="/admin/products">
                    <ProductsListView />
                </Route>
                <Route path="/admin/product/:productId/update">
                    <UpdateProductsView />
                </Route>
                <Route path="/admin/product/:productId/view">
                    <DetailedProductsView />
                </Route>
                <Route path="/admin/product/add">
                    <AddNewProductsView />
                </Route>


                <Route path="/admin/categories">
                    <CategoriesListView />
                </Route>
                <Route path="/admin/category/:categoryId/update">
                    <UpdateCategoriesView />
                </Route>
                <Route path="/admin/category/:categoryId/view">
                    <DetailedCategoriesView />
                </Route>
                <Route path="/admin/category/add">
                    <AddNewCategoriesView />
                </Route>


                <Route path="/admin/orders">
                    <OrdersListView />
                </Route>
                <Route path="/admin/order/:orderId/update">
                    <UpdateOrdersView />
                </Route>
                <Route path="/admin/order/:orderId/view">
                    <DetailedOrdersView />
                </Route>
                <Route path="/admin/order/add">
                    <AddNewOrdersView />
                </Route>


                <Route path="/admin/reviews">
                    <ReviewsListView />
                </Route>
                <Route path="/admin/review/:reviewId/update">
                    <UpdateReviewsView />
                </Route>
                <Route path="/admin/review/:reviewId/view">
                    <DetailedReviewsView />
                </Route>
                <Route path="/admin/review/add">
                    <AddNewReviewsView />
                </Route>



                <Route
                  path="/firebase/collection/:collectionId"
                  render={(props) => (
                    <div>Collections</div>)
                  }
                />
                <Route path="/page/:pageid"  />
                <Route path="/admin/logout">
                  <LogoutView />
                </Route>
                <Route path="/admin">
                  <HomePage />
                </Route>
                <Route path="/">
                  <div>This is the first page a logged in user can see</div>
                </Route>
              </Switch>
            </div>
          </div>
      );
}

export default AdminView;