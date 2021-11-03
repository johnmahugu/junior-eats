const admin = require("firebase-admin");
const serviceAccount = require("./production-a9404-firebase-adminsdk-nin6u-d632b424d4.json");
const dbURL = "https://production-a9404.firebaseio.com";
const bucketURL = "production-a9404.appspot.com";
const { v4: uuidv4 } = require('uuid');

class FirebaseDBManager {
    constructor() {
        this.firebaseDB = null
    }

    connectDB = async (callback) => {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: dbURL,
            storageBucket: bucketURL,
        });

        this.firebaseDB = admin.firestore();
        this.firebaseAuth = admin.auth();
        this.firebaseStorage = admin.storage();
        this.firebaseDB.settings({ ignoreUndefinedProperties: true })
        console.log("Connected to Firebase DB");

        callback(this.firebaseDB)
    };

    register = async (userData, callback) => {
        const {email, password} = userData
        this.firebaseAuth
            .createUser({email, password})
            .then(user => {
                const uid = user.uid

                const data = {
                    ...userData,
                    id: uid,
                    userID: uid,
                    createdAt: admin.firestore.FieldValue.serverTimestamp() ,
                }
                const userRef = this.firebaseDB.collection("users").doc(uid)
                userRef
                    .set({...data})
                    .then((response) => {
                        callback(data)
                        console.log("Inserted user successfully!")
                    })
                    .catch((err) => {
                        console.log("Couldn't insert user: ", err)
                    })

            })
            .catch(error => {
                console.log(error)
            });
    } 

    // loginWithEmailAndPassword = async (email, password, callback) => {
    //     this.firebaseAuth
    //         .getUserByEmail(email)
    //         .then(user => {
    //             console.log(user)
    //             callback({id: user.uid})
    //         })
    //         .catch((error) => {
    //             callback(null, error)
    //             console.log(error)
    //         });
    // }

    uploadMedia = async (data, callback) => {
        //getting the default bucket
        var bucket = this.firebaseStorage.bucket();

        Promise.all(data.map((media) => {
            const uuid = uuidv4()
            return new Promise((resolve, reject) => {
                bucket
                    .file(media.name)
                    .save(media.data, {
                        uploadType: "media",
                        metadata: {
                            contentType: media.mimetype,
                            firebaseStorageDownloadTokens: uuid,
                    }
                    })
                    .then(
                        _response => {
                            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${media.name}?alt=media&token=${uuid}`
                            const myData = {
                                url,
                                name: media.name,
                                mimetype: media.mimetype,
                            }
                            resolve(myData)
                        },
                        err => {
                            reject(err)
                        }
                    )
            })
        })).then((data) => {
            callback(data)
        })
    }

    // uploadMedia = async (data, callback) => {
    //     //getting the default bucket
    //     var bucket = admin.storage().bucket();

    //     const uuid = uuidv4()
    //     bucket.file(data.name).save(data.data, {
    //         uploadType: "media",
    //         metadata: {
    //             contentType: data.mimetype,
    //             firebaseStorageDownloadTokens: uuid,
    //         }
    //     }, err => {
    //         if (!err) {
    //             const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${data.name}?alt=media&token=${uuid}`
    //             callback({
    //                 url,
    //                 name: data.name,
    //                 mimetype: data.mimetype,
    //             })
    //         } else {
    //             callback(null, err)
    //         }
    //     })
    // }

    getOne = async (tableName, id, callback) => {
        const ref = this.firebaseDB.collection(tableName).doc(id)
        ref
            .get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                } else {
                    callback({ ...doc.data(), id: doc.id });
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });

    };

    findOne = async (tableName, whereClauseDict, callback) => {
        const ref = this.firebaseDB.collection(tableName);
        const key = Object.keys(whereClauseDict)[0];
        const value = whereClauseDict[key];
        ref
            .where(key, "==", value)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    callback(null);
                } else {
                    snapshot.forEach(doc => {
                        callback({ ...doc.data(), id: doc.id });
                    });
                }
            })
    };

    insertOne = async (tableName, doc, callback) => {
        try {
            var ref
            if (doc.id) {
                ref = this.firebaseDB.collection(tableName).doc(doc.id);
            } else {
                ref = this.firebaseDB.collection(tableName).doc();
            }
            ref
                .set({ ...doc, id: ref.id })
                .then(response => {
                    callback({ success: true });
                });
        } catch (e) {
            callback({ success: false });
        }
    };

    updateOne = async (tableName, id, data, callback) => {
        try {
            const ref = this.firebaseDB.collection(tableName);
            ref
                .doc(id)
                .set(data, { merge: true })
                .then(response => {
                    callback(null, { success: true });
                });
        } catch (e) {
            console.log(e)
            callback(e, { success: false });
        }
    };

    list = async (tableName, query, callback) => {
        var ref = this.firebaseDB.collection(tableName)
        const { orderByClause, limit, search } = query
        if (orderByClause) {
            const { field, desc } = orderByClause
            if (field && !desc) {
                ref = ref.orderBy(field)
            } else if (field && desc) {
                ref = ref.orderBy(field, 'desc')
            }
        }
        if (limit && !search) {
            ref = ref.limit(parseInt(limit))
        }
        ref
            .get()
            .then(querySnapshot => {
                let docs = querySnapshot.docs
                var results = docs.map(doc => ({ ...doc.data(), id: doc.id }))
                if (search && search.length > 0) {
                    results = results.filter(result => {
                        var canFind = false
                        Object.keys(result).forEach(key => {
                            const value = result[key];
                            if (value && String(value).toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                                canFind = true
                            }
                        })
                        return canFind
                    })
                    if (limit) {
                        results = results.slice(0, parseInt(limit))
                    }
                }
                callback(results)
            });
    };

    deleteOne = async (tableName, id, callback) => {
        try {
            const ref = this.firebaseDB.collection(tableName);
            ref
                .doc(id)
                .delete()
                .then(response => {
                    callback(null, { success: true });
                });
        } catch (e) {
            console.log(e)
            callback(e, { success: false });
        }
    }

    getChat = async (tableName, channelId, query, callback) => {
        var chat = this.firebaseDB.collection(tableName).doc(channelId);

        chat.get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    //This means the chat exists so we have to get the data from the thread subcollection
                    var ref = chat.collection('thread')
                    const { orderByClause, limit, search } = query
                    if (orderByClause) {
                        const { field, desc } = orderByClause
                        if (field && !desc) {
                            ref = ref.orderBy(field)
                        } else if (field && desc) {
                            ref = ref.orderBy(field, 'desc')
                        }
                    }
                    if (limit && !search) {
                        ref = ref.limit(parseInt(limit))
                    }
                    ref
                        .get()
                        .then(querySnapshot => {
                            let docs = querySnapshot.docs
                            var results = docs.map(doc => ({ ...doc.data(), id: doc.id }))
                            if (search && search.length > 0) {
                                results = results.filter(result => {
                                    var canFind = false
                                    Object.keys(result).forEach(key => {
                                        const value = result[key];
                                        if (value && String(value).toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                                            canFind = true
                                        }
                                    })
                                    return canFind
                                })
                                if (limit) {
                                    results = results.slice(0, parseInt(limit))
                                }
                            }
                            callback(results)
                        });
                } else {
                    //This means the chat doesn't exist
                    console.log("The chat doesn't exist!")
                    callback(null)
                }
            })
    }

    createChat = async (tableName, channelId, doc, callback) => {
        try {
            const ref = this.firebaseDB.collection(tableName).doc(channelId)
            ref
                .set({ ...doc, id: ref.id }, { merge: true })
                .then(response => {
                    callback({ success: true });
                });
        } catch (e) {
            callback({ success: false });
        }
    }

    insertMessage = async (tableName, channelId, doc, callback) => {
        try {
            //Adding message to thread
            const ref = this.firebaseDB.collection(tableName).doc(channelId).collection('thread').doc()
            ref
                .set({ ...doc, id: ref.id })
                .then(response => {
                    //Updating last messages in the channel
                    const updateChannelRef = this.firebaseDB.collection(tableName).doc(channelId)
                    updateChannelRef.set({
                        lastMessage: doc.content,
                        lastMessageSenderId: doc.senderID,
                        lastThreadMessageId: ref.id,
                    }, { merge: true })
                    callback({ success: true });
                });
        } catch (e) {
            callback({ success: false });
        }
    }

}

module.exports = FirebaseDBManager;
