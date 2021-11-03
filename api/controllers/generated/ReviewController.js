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

        db.list("vendor_reviews", clauses, reviewList => {
            //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
            res.json({reviews: reviewList});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.createNewReview = async function(req, res, db) {
    try {
        const body = req.body;
        db.insertOne("vendor_reviews", body, response => {
            res.json(response);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

exports.fetchReview = function(req, res, db) {
    db.getOne("vendor_reviews", req.params.reviewId, data => {
        res.json({...data});
    })
}

exports.updateReview = function(req, res, db) {
    const body = req.body
    const reviewId = req.params.reviewId
    var modifiedData = body
    delete modifiedData.id
    delete modifiedData._id

    db.updateOne("vendor_reviews", reviewId, modifiedData, function(err, data) {
        if(err) {
            return res.status(500).send(err);
        }
        res.json(data);
    });

}

exports.deleteReview = function(req, res, db) {
    const reviewId = req.params.reviewId

    db.deleteOne("vendor_reviews", reviewId, function(err, data) {
        if (err) {
            console.log("error")
            return res.status(500).send(err);
        }
        console.log("The review has been deleted!")
        res.json({success: true});
    });

}
