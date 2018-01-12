const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
//const votesCollection = mongoCollections.votesAndMetrics;
const uuid = require('node-uuid');
const bcrypt = require('bcryptjs');
//const votesAndMetrics = require("./votesandmetrics");
let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        });
    },
    getUserById(id) {
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id }).then((user) => {
                if (!user) return Promise.reject("User not found");

                return user;
            });
        });
    },
    getUserByUsername(username) {
        return users().then((userCollection) => {
            return userCollection.findOne({ username: username }).then((user) => {
                return user;
            });
        });
    },
    getUserByUsernameOrEmail(username, email) {
        return users().then((userCollection) => {
            return userCollection.findOne({$or:[{ username: username }, { email: email }]}).then((user) => {
                return user;
            });
        });
    },
    addUser(username, firstName, lastName, email, gender, city, state, age, hashedPassword) {
        //need error checking here

        if (username === undefined || username === "") return Promise.reject("No username given");
        if (firstName === undefined || firstName === "") return Promise.reject("No first name given");
        if (lastName === undefined || lastName === "") return Promise.reject("No last name given");
        if (email === undefined || email === "") return Promise.reject("No email given");
        if (gender === undefined || gender === "") return Promise.reject("No gender given");
        if (city === undefined || city === "") return Promise.reject("No city given");
        if (state === undefined || state === "") return Promise.reject("No state given");
        if (age === undefined || age === "") return Promise.reject("No age given");
        if (hashedPassword === undefined || hashedPassword === "") return Promise.reject("No password given");

        return users().then((userCollection) => {
            let newUser = {
                _id: uuid.v4(),
                username: username.toLowerCase(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                gender: gender,
                city: city,
                state: state,
                age: age,
                password: hashedPassword,
                pollsCreated: [],
                pollsVotedIn: []
            };
            return userCollection.insertOne(newUser).then((newInsertInformation) => {
                return newInsertInformation.insertedId;
            }).then((newId) => {
                return this.getUserById(newId);
            });
        });

    },

    createHashedPassword(password) {
        return new Promise((fulfill, reject) => {
            if (!password) reject("Password not given");
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    if (err) reject(err);
                    fulfill(hash);
                });
            });
        });

    },

    removeUser(id) {
        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id }).then((deletionInfo) => {
                if (deletionInfo.deletedCount === 0) {
                    throw (`Could not delete user with id of ${id}`)
                }
            });
        });
    },
 
    addPollCreatedToUser(userId, pollId) {
        return users().then((userCollection) => {
            return this.getUserById(userId).then((currentUser) => {
                return userCollection.updateOne({ _id: userId }, {
                    $push: {
                        pollsCreated: {
                            pollId: pollId
                        }
                    }
                });
            });
        });
    },
    addPollVotedInToUser(userId, pollId, ansChoiceUserSelected) {
        return users().then((userCollection) => {
            return this.getUserById(userId).then((currentUser) => {
                return userCollection.updateOne({ _id: userId }, {
                    $addToSet: {
                        pollsVotedIn: {
                            pollId: pollId,
                            ansChoiceSelected: ansChoiceUserSelected
                        }
                    }
                });
            });
        });
    },
    removePollFromUser(userId, pollId) {
        return this.getUserById(userId).then((currentUser) => {
            return userCollection.updateOne({ _id: id }, {
                $pull: {
                    pollsCreated: {
                        pollId: pollId
                    }
                }
            });
        });
    },
    getPollsUserVotedin(userId) {
        if (!userId)
            return Promise.reject("No userId provided");

        return this.getUserById(userId).then((user) => {
            var pollsVotedIn = user.pollsVotedIn;
            console.log(pollsVotedIn.length)
            return pollsVotedIn;

        });

    },

    isPasswordValid(user, password) {
        return new Promise((fulfill, reject) => {
            if (!user) reject("User not given");
            if (!password) reject("Password not given");
            bcrypt.compare(password, user.password, function (err, res) {
                if (err) reject(err);
                fulfill(res);
            });

        });

    }
}

module.exports = exportedMethods;
