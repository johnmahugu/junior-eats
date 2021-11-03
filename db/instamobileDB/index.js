const FirebaseDBManager = require('../firebaseDB')

class InstamobileDB {

    constructor(dbType) {
        this.dbType = dbType
        this.db = null
        this.dbManager = null
    }

    connectDB = async (callback) => {
        if (this.dbType === 'firebaseDB') {
            this.dbManager = new FirebaseDBManager();
            this.dbManager.connectDB(db => {
                this.db = db
                console.log("FirebaseDB connected")
                callback(db)
            })
            return
        }
        console.error("Database type " + this.dbType + " not supported")
    }

    register = async (userData, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting to register with not database connected.")
        }
        this.dbManager.register(userData, callback)
    }

    loginWithEmailAndPassword = async (email, password, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting to login with not database connected.")
        }
        this.dbManager.loginWithEmailAndPassword(email, password, callback)
    }

    uploadMedia = async (data, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting to upload with no database connected.")
        }
        this.dbManager.uploadMedia(data, callback)
    }

    authorizeUser = async (id, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting user authorization operation with not database connected.")
        }
        this.dbManager.getOne("users", id, callback)
    }

    insertOne =  async (tableName, data, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting insert operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.insertOne(tableName, data, callback);
    };

    getOne = async (tableName, id, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting getone operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.getOne(tableName, id, callback)
    }

    findOne = async (tableName, whereClauseDict, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting find operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.findOne(tableName, whereClauseDict, callback)
    }

    list = async (tableName, query, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting list operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.list(tableName, query, callback)
    }

    updateOne = async (tableName, id, data, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting update operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.updateOne(tableName, id, data, callback)
    }

    deleteOne = async (tableName, id, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting delete operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.deleteOne(tableName, id, callback);
    }

    getChat = async (tableName, channel, query, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting get operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.getChat(tableName, channel, query, callback);
    }

    createChat = async (tableName, channel, data, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting create operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.createChat(tableName, channel, data, callback);
    }

    insertMessage = async (tableName, channel, data, callback) => {
        if (!this.db || !this.dbManager) {
            console.error("Attempting insert operation in " + tableName + "  with not database connected.")
        }
        this.dbManager.insertMessage(tableName, channel, data, callback);
    }
}

module.exports = InstamobileDB