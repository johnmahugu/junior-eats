import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

import "./styles.css";

function Menu() {
    const [isLoading, setIsLoading] = useState(false);
    const [menuItems, setMenuItems] = useState(null);

    useEffect(() => {
        setMenuItems([
            // Insert more menu items here
            {
                title: "Restaurants",
                path: "restaurants",
                subItems: []
            },
            {
                title: "Products",
                path: "products",
                subItems: []
            },
            {
                title: "Categories",
                path: "categories",
                subItems: []
            },
            {
                title: "Orders",
                path: "orders",
                subItems: []
            },
            {
                title: "Reviews",
                path: "reviews",
                subItems: []
            },
            {
                title: "Customers",
                path: "users",
                subItems: []
            },
            {
                title: "Push Notifications",
                path: "sendNotification",
                subItems: []
            },
            {
                title: "E-mail",
                path: "sendEmail",
                subItems: []
            },
            {
                title: "Logout",
                path: "logout",
                subItems: []
            }
        ])
    }, []);

    if (isLoading) {
        return (
            <div className="MenuContainer sweet-loading card">
                <div class="spinner-container">
                    <ClipLoader
                        className="spinner"
                        sizeUnit={"px"}
                        size={50}
                        color={'#123abc'}
                        loading={isLoading}
                    />
                </div>
            </div> 
        )
    }

    return (
        <div className="MenuContainer">
            <div className="MenuHeader">
                    <h4>Admin Dashboard</h4>
                </div>
            {menuItems && menuItems.length > 0 ? (
                <div className="MenuBody">
                    <div className="MenuItemsContainer">
                        <ul className="MenuItemsList nav">
                            {
                                menuItems.map(function(menuItem, index) {
                                    return (
                                        <li key={menuItem.path}>
                                            <a href={"/admin/" + menuItem.path} data-toggle="collapse" aria-expanded="false"><i className="nc-icon nc-book-bookmark"></i><p>{menuItem.title}<b className="caret"></b></p></a>
                                            <div className="collapse" id={menuItem.path}>
                                                <ul className="nav">
                                                    {
                                                        menuItem.subItems.map(function(subitem, index) {
                                                            return (
                                                                <li key={subitem.title} className="">
                                                                    <a href={"#/" + subitem.path}><span className="sidebar-normal">{subitem.title}</span></a>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </li>
                                    )    
                                })
                            }
                        </ul>
                    </div>
                </div>
            ) : (
                <div>
                    <p>There are not rows in this collection.</p>
                </div>
            )}
        </div>
    );
}

export default Menu;
