'use strict';

const { v4: uuidv4 } = require('uuid');
const { rootURL } = require('./config')

// Given a list of files, it uploads them to the server and returns an array of download URLs
exports.upload = function(req, res, db) {
    // const files = db.collection('files') - use this if you want to save the paths to the database
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
            // loop all files
            var photos = req.files.photos
            if (photos && !photos.length) {
                photos = [photos]
            }
            photos.forEach(photo => {
                // move photo to uploads directory
                const path = 'uploads/' + uuidv4() + '/' + photo.name
                photo.mv("./" + path);

                // push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size,
                    url: rootURL + path
                });
            })

            // return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500)
    }
};

exports.uploadToDatabase = function(req, res, db) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            var photos = req.files.photos
            if (photos && !photos.length) {
                photos = [photos]
            }

            db.uploadMedia(photos, (data, errors) => {
                // return response
                if (errors) {
                    res.status(400).json(errors)
                }
                res.send({
                    status: true,
                    message: 'Files are uploaded',
                    data: data
                });
            })
        }
    } catch (err) {
        res.status(500)
    }
}

exports.uploadMultimedias = function(req, res, db) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
            // loop all files
            var medias = req.files.multimedias
            if (medias && !medias.length) {
                medias = [medias]
            }
            medias.forEach(media => {
                // move photo to uploads directory
                const path = 'uploads/' + uuidv4() + '/' + media.name
                media.mv("./" + path);

                // push file details
                data.push({
                    name: media.name,
                    mimetype: media.mimetype,
                    size: media.size,
                    url: rootURL + path
                });
            })

            // return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500)
    }
};

exports.uploadMultimediasToDatabase = function(req, res, db) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            var medias = req.files.multimedias
            if (medias && !medias.length) {
                medias = [medias]
            }

            db.uploadMedia(medias, (data, errors) => {
                // return response
                if (errors) {
                    res.status(400).json(errors)
                }
                res.send({
                    status: true,
                    message: 'Files are uploaded',
                    data: data
                });
            })
        }
    } catch (err) {
        res.status(500)
    }
}
