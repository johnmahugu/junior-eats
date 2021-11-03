'use strict';
const fetch = require("node-fetch");
const fcmURL = 'https://fcm.googleapis.com/fcm/send';
const firebaseServerKey =
    'AAAAeliTfEs:APA91bGve5fyExjSiUCB0oI09Br1yGUSb0tPHelAk7L0FUytHWGOMlBPexJubTwSjjJTaIlK7oto3jDevoj9c5Q4Qalk6QEtQ9Y3tYfTxHD7OrmPZuVJjVGGciPBJXThG9QHCZQqx9Id';


exports.sendPushNotificationToAllUsers = async function (req, res, db) {
    try {
        const query = req.query //orderBy=pushToken query so it selects only the users with pushToken
        const body = req.body
        const orderByClause = (query && query.orderBy ? {
            field: query.orderBy,
            desc: query.desc
        } : null
        )
        var clauses = {}
        if (orderByClause) {
            clauses.orderByClause = orderByClause
        }
        if (query.search) {
            clauses.search = query.search
        }
        if (query.limit) {
            clauses.limit = query.limit
        }

        db.insertOne("push_notifications", req.body, response => {
            console.log("Adding to push_notifications table: " + response.success)
        })

        db.list("users", clauses, userList => {
            const pushTokenKeys = userList.filter(u => u.pushToken!=='').flatMap(u => u.pushToken);
           
            const pushNotification = {
                registration_ids: pushTokenKeys,
                notification: {
                    title: body.title,
                    body: body.message,
                    icon: body.icon,
                },
            }
            fetch(fcmURL, {
                method: 'post',
                headers: {
                    Authorization: 'key=' + firebaseServerKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pushNotification),
            })
            .then(response => { 
                res.json(response);
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
