const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const pollsData = data.polls;
const usersPollsData = data.usersandpolls;
const votesmatrixData = data.votesAndMetrics;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const xss = require('xss');

router.get("/", function (request, response) {

    pollsData.getAllPolls().then((polls) => {
        let pollsInfo = [];
        for (i = 0; i < polls.length; i++) {
            let subpoll = {};
            subpoll._id = polls[i]._id;
            subpoll.question = polls[i].question;
            subpoll.category = polls[i].category;
            subpoll.postedDate = polls[i].postedDate;
            votesmatrixData.getVotesForPoll(polls[i]._id).then((votes) => {
                if (votes) {
                    subpoll.votes = votes.totalVotesForPoll;
                }
            })
            pollsInfo.push(subpoll);
        }
        response.render("pollme/home_before_login", { poll: pollsInfo, loginuser: xss(request.user) });
    })
        .catch((error) => {
            response.status(404).json({ error: "Error!Poll not found" });
        });
});

router.get("/createpoll", function (request, response) {

    if (request.isAuthenticated()) {
        //Render the make poll page or something like that
        //request.user.username has username of user
        response.render('pollme/create_poll', { user: xss(request.user), loginuser: xss(request.user) });
    }
    else {
        //Render a login page
        request.flash('redirectPage', '/createpoll');
        response.redirect("/login");
    }
});

router.post("/createpoll", function (request, response) {

    var newPoll = request.body;
    if (request.isAuthenticated()) {
        var currentDate = new Date();
        pollsData.addPoll(xss(newPoll.category), currentDate, xss(newPoll.question), xss(newPoll.choice1), xss(newPoll.choice2), xss(newPoll.choice3), xss(newPoll.choice4), xss(request.user._id)).then((pollid) => {
            response.redirect("/poll/" + pollid);
        }, (err) => {
            console.log(err);
        });
    }
    else {
        //Render a login page
        request.flash('redirectPage', '/createpoll');
        response.redirect("/login");
    }
});

router.post("/editpollpage", function (request, response) {
    // Create a result set to contain data from different collections.
    if (request.isAuthenticated()) {
        pollsData.getPollById(xss(request.body.pollid)).then((poll) => {
            votesmatrixData.getVotesForPoll(xss(request.body.pollid)).then((vote) => {
                console.log(vote);
                if (vote == null || vote === undefined) {
                    response.render("pollme/edit_poll", { poll: poll });
                }
                else {
                    //Can't edit poll because votes were already made
                    console.log("Can't edit poll");
                    response.redirect("/poll/" + request.body.pollid);
                }
            })
        })
            .catch(() => {
                res.status(404).json({ error: "Error!Poll not found" });
            })
    }
    else {
        response.redirect("/login");
    }
});

router.post("/editpoll", function (request, response) {

    var editPoll = request.body;
    if (request.isAuthenticated()) {
        var currentDate = new Date();
        pollsData.editPoll(editPoll.pollId, editPoll.category, currentDate, xss(editPoll.question), xss(editPoll.choice1), xss(editPoll.choice2), xss(editPoll.choice3), xss(editPoll.choice4)).then((poll) => {
            response.redirect("/poll/" + poll._id);
        }, (err) => {
            console.log(err);
        });

    }
    else {
        request.flash('redirectPage', '/poll/' + editPoll.pollId);
        response.redirect("/login");
    }
});

router.post("/deleteconfirm", function (request, response) {
    if (request.isAuthenticated()) {
        response.render("pollme/delete_confirm", { pollid: request.body.pollid });
    }
    else {
        request.flash('redirectPage', '/poll/' + request.body.pollid);
        response.redirect("/login");
    }
});

router.post("/deletepoll", function (request, response) {
    if (request.isAuthenticated()) {
        pollsData.removePoll(request.body.pollid).then(() => {
            response.redirect("/mypolls");
        });
    }
    else {
        request.flash('redirectPage', '/poll/' + request.body.pollid);
        response.redirect("/login");
    }
});

router.get("/poll/:id", function (request, response) {
    // Create a result set to contain data from different collections.
    let pollResult = {};
    pollsData.getPollById(xss(request.params.id)).then((pollInfo) => {
        pollResult.poll = pollInfo;
    }).then(() => {
        pollResult.user = request.user;
        votesmatrixData.getVotesForPoll(xss(request.params.id)).then((voteInfo) => {
            pollResult.vote = voteInfo;
            if (request.isAuthenticated()) {
                if (pollResult.poll.createdByUser === request.user._id)
                    response.render("pollme/single_poll", { poll: pollResult, loginuser: xss(request.user), auth: true });
                else
                    response.render("pollme/single_poll", { poll: pollResult, loginuser: xss(request.user) });
            }
            else
                response.render("pollme/single_poll", { poll: pollResult, loginuser: xss(request.user) });
        })
    })
        .catch(() => {
            res.status(404).json({ error: "Error!Poll not found" });
        })
});

router.post("/voteonpoll", function (request, response) {

    var vote = request.body;
    var user = request.user;
    console.log(vote);

    if (request.isAuthenticated()) {
        var theyVoted = false;
        usersData.getPollsUserVotedin(xss(vote.userid)).then((polls) => {
            console.log(polls)
            for (var i = 0; i < polls.length; i++) {
                if (polls[i].pollId == vote.pollid) {
                    theyVoted = true;
                }
            }
            if (theyVoted == true) {
                
                let pollResult = {};
                pollsData.getPollById(vote.pollid).then((pollInfo) => {
                    pollResult.poll = pollInfo;
                }).then(() => {
                    pollResult.user = request.user;
                    votesmatrixData.getVotesForPoll(vote.pollid).then((voteInfo) => {
                        pollResult.vote = voteInfo;
                        request.flash('error', 'User Voted already in poll');
                        response.render("pollme/single_poll", { poll: pollResult, error: request.flash().error, loginuser: request.user });
                    }, (err) => {
                        console.log(err);
                    })
                })
                    .catch(() => {
                        res.status(404).json({ error: "Error!Poll not found" });
                    })

            } else {
                votesmatrixData.countVote(vote.pollid, vote.selector, vote.userid, user.gender).then(() => {
                    let voted = true;
                    let pollResult = {};
                    pollsData.getPollById(vote.pollid).then((pollInfo) => {
                        pollResult.poll = pollInfo;
                    }).then(() => {
                        pollResult.user = request.user;
                         request.flash('error', 'Vote Counted! Thank You for Voting!');
                        votesmatrixData.getVotesForPoll(vote.pollid).then((voteInfo) => {
                            pollResult.vote = voteInfo;
                           
                            if (pollResult.poll.createdByUser === request.user._id)
                                response.render("pollme/single_poll", { poll: pollResult, error: request.flash().error, loginuser: xss(request.user), auth: true });
                            else
                                response.render("pollme/single_poll", { poll: pollResult, error: request.flash().error, loginuser: xss(request.user) });
                        }, (err) => {
                            console.log(err);
                        })
                    })

                });
            }
        }, (err) => {
            console.log(err);
        })
    }
    else {
        //Render a login page
        console.log('/poll/' + request.body.pollid);
        request.flash('redirectPage', '/poll/' + request.body.pollid);
        response.redirect("/login");
    }
});

router.post("/search", function (request, response) {
    //If they do not eneter a search term or category to search
    if (!xss(request.body.keyword) && xss(request.body.category) == "null") {
        Promise.reject("You must specify a search term or category to search");
        // If they enter a search term but no category
    } else if (xss(request.body.keyword) && xss(request.body.category) == "null") {
        return pollsData.searchPollsByKeyword(xss(request.body.keyword).trim()).then((searchResults) => {
            let pollsInfo = [];
            for (i = 0; i < searchResults.length; i++) {
                let subpoll = {};
                subpoll._id = searchResults[i]._id;
                subpoll.question = searchResults[i].question;
                subpoll.category = searchResults[i].category;
                subpoll.postedDate = searchResults[i].postedDate;
                votesmatrixData.getVotesForPoll(searchResults[i]._id).then((votes) => {
                    if (votes) {
                        subpoll.votes = votes.totalVotesForPoll;
                    }
                })
                pollsInfo.push(subpoll);
            }
            //render page here
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", { poll: pollsInfo, loginuser: xss(request.user) });
        });
        //If they search category but no keyword
    } else if (xss(request.body.category) && !xss(request.body.keyword)) {
        return pollsData.getPollsByCategory(xss(request.body.category)).then((searchResults) => {
            //render page here
            let pollsInfo = [];
            for (i = 0; i < searchResults.length; i++) {
                let subpoll = {};
                subpoll._id = searchResults[i]._id;
                subpoll.question = searchResults[i].question;
                subpoll.category = searchResults[i].category;
                subpoll.postedDate = searchResults[i].postedDate;
                votesmatrixData.getVotesForPoll(searchResults[i]._id).then((votes) => {
                    if (votes) {
                        subpoll.votes = votes.totalVotesForPoll;
                    }
                })
                pollsInfo.push(subpoll);
            }
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", { poll: pollsInfo, loginuser: xss(request.user) });
        });
        //If they search by keyword and category
    } else {
        return pollsData.searchPollsByKeywordAndCategory(xss(request.body.keyword).trim(), xss(request.body.category)).then((searchResults) => {
            //render page here
            let pollsInfo = [];
            for (i = 0; i < searchResults.length; i++) {
                let subpoll = {};
                subpoll._id = searchResults[i]._id;
                subpoll.question = searchResults[i].question;
                subpoll.category = searchResults[i].category;
                subpoll.postedDate = searchResults[i].postedDate;
                votesmatrixData.getVotesForPoll(searchResults[i]._id).then((votes) => {
                    if (votes) {
                        subpoll.votes = votes.totalVotesForPoll;
                    }
                })
                pollsInfo.push(subpoll);
            }
            //res.render('locations/single', { searchResults: searchResults});
            response.render("pollme/home_before_login", { poll: pollsInfo, loginuser: xss(request.user) });
        });
    }
});

router.post("/commentonpoll", function (request, response) {

    if (request.isAuthenticated()) {
        // Allowed to comment on poll
        // request.user.username has username of user
        if (xss(request.body.comment) && xss(request.body.comment) !== "")
            pollsData.addCommentToPoll(xss(request.body.pollid), xss(request.user.username), xss(request.body.comment)).then(() => {
                response.redirect("/poll/" + xss(request.body.pollid));
            }, (err) => {
                console.log(err);
            });
        else
            response.redirect("/poll/" + xss(request.body.pollid));
    }
    else {
        //Render a login page
        request.flash('redirectPage', '/poll/' + request.body.pollid);
        response.redirect("/login");
    }
});

module.exports = router;
