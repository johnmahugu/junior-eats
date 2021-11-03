'use strict';

exports.list = async function(req, res, db) {
    try {
        const query = req.query
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

        db.list("restaurant_orders", clauses, orderList => {
            //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
            res.json({orders: orderList});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.createNewOrder = async function(req, res, db) {
    try {
        const body = req.body;
        db.insertOne("restaurant_orders", body, response => {
            res.json(response);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.fetchOrder = function(req, res, db) {
    db.getOne("restaurant_orders", req.params.orderId, data => {
        res.json({...data});
    })
}

exports.updateOrder = function(req, res, db) {
    const body = req.body
    const orderId = req.params.orderId
    var modifiedData = body
    delete modifiedData.id
    delete modifiedData._id

    db.updateOne("restaurant_orders", orderId, modifiedData, function(err, data) {
        if(err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });

}

exports.deleteOrder = function(req, res, db) {
    const orderId = req.params.orderId

    db.deleteOne("restaurant_orders", orderId, function(err, data) {
        if (err) {
            console.log("error")
            return res.status(500).send(err);
        }
        console.log("The order has been deleted!")
        res.json({success: true});
    });

}
