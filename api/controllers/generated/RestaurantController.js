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

        db.list("vendors", clauses, restaurantList => {
            //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
            res.json({restaurants: restaurantList});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.createNewRestaurant = async function(req, res, db) {
    try {
        const body = req.body;
        db.insertOne("vendors", body, response => {
            res.json(response);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.fetchRestaurant = function(req, res, db) {
    db.getOne("vendors", req.params.restaurantId, data => {
        res.json({...data});
    })
}

exports.updateRestaurant = function(req, res, db) {
    const body = req.body
    const restaurantId = req.params.restaurantId
    var modifiedData = body
    delete modifiedData.id
    delete modifiedData._id

    db.updateOne("vendors", restaurantId, modifiedData, function(err, data) {
        if(err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });

}

exports.deleteRestaurant = function(req, res, db) {
    const restaurantId = req.params.restaurantId

    db.deleteOne("vendors", restaurantId, function(err, data) {
        if (err) {
            console.log("error")
            return res.status(500).send(err);
        }
        console.log("The restaurant has been deleted!")
        res.json({success: true});
    });

}
