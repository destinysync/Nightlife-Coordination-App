'use strict';

var Yelp = require('yelp');
var path = process.cwd();
var User = require('../models/users');

function ClickHandler() {

    this.cookiesParser = function(req, res) {

        if (req.cookies.searchV === undefined) {
            res.render(path + '/public/ejs/nightLifeIndex.ejs', {
                searchR: ""
            });
        }
        else {
            var searchInput = req.cookies.searchV;

            var yelp = new Yelp({
                consumer_key: 'woMVuwaBLEw27Sjb6fjO-g',
                consumer_secret: '26ZYlNEV5ZZRzugZRNhuW7TC9pA',
                token: 'F-W06naE4TpNrFj7DQawACb2hHAsWML2',
                token_secret: '8lSeea1lPrET5GLykQFLdJqKdJI'
            });

            yelp.search({
                    category_filter: 'bars',
                    location: searchInput
                })
                .then(function(data) {
                    var body = '',
                        count = 0,
                        barsDiv = '';

                    data.businesses.forEach(function(item) {

                        function trimText(text) {
                            if (text.length > 154) {
                                var newText = '';
                                for (var i = 0; i < 155; i++) {
                                    newText += text[i];
                                }
                                newText += '...';
                                return newText;
                            }
                            return text;
                        }

                        var imageURL = item.image_url,
                            barName = item.name,
                            barRating = item.rating_img_url,
                            barSnippetText = trimText(item.snippet_text),
                            barID = item.id,
                            goingCount = 10;

                        function first(callback) {
                            User.findOne({
                                'goingCount.barID': barID
                            }, function(err, bar) {
                                if (err) {
                                    return err;
                                }
                                if (bar) {
                                    goingCount = bar.goingCount.goingCount;
                                    count++;
                                    callback();
                                }
                                else {
                                    var newUser = new User();

                                    newUser.goingCount.barID = barID;
                                    newUser.goingCount.goingCount = 0;
                                    goingCount = 0;

                                    newUser.save(function(err) {
                                        if (err) {
                                            throw err;
                                        }
                                    });
                                    count++;
                                    callback();
                                }
                            });
                        }

                        function sec() {
                            var imgDiv = '<div class="imgDiv"><a href=' + item.url + '><img class="barImg" src=' + imageURL + "></a></div>";
                            var barNameDiv = '<div class="barNameAndGoingContainer"><a href=' + item.url + '<span class="barName">' + '<b>' + barName + '</b>' + '</span></a><br>';
                            var barRatingDiv = '<img class="barRating" src=' + barRating + '><br><div' + '><button class="going" id=' + item.id + '>' + goingCount + ' GOING</button></div></div>';
                            var barSnippetTextDiv = '<span class="barSnippetText">' + '<i>' + barSnippetText + '</i>' + '</span>';

                            body += '<div class="col-lg-3">' + imgDiv + barNameDiv + barRatingDiv + barSnippetTextDiv + '</div>';

                            if (count % 4 == 0) {
                                barsDiv += '<div class="row">' + body + '</div>';
                                body = "";
                            }

                            if (count == data.businesses.length) {
                                res.render(path + '/public/ejs/nightLifeIndex.ejs', {
                                    searchR: barsDiv
                                });
                            }
                        }

                        first(sec);
                    });
                })
                .catch(function(err) {
                    console.error(err);
                });

        }
    };

    this.searchResult = function(req, res) {

        var searchInput = req.url.match(/\/searchResult\/(.*)/)[1];

        res.cookie('searchV', searchInput);

        var yelp = new Yelp({
            consumer_key: 'woMVuwaBLEw27Sjb6fjO-g',
            consumer_secret: '26ZYlNEV5ZZRzugZRNhuW7TC9pA',
            token: 'F-W06naE4TpNrFj7DQawACb2hHAsWML2',
            token_secret: '8lSeea1lPrET5GLykQFLdJqKdJI'
        });

        yelp.search({
                category_filter: 'bars',
                location: searchInput
            })
            .then(function(data) {
                var body = '',
                    count = 0,
                    barsDiv = '';

                data.businesses.forEach(function(item) {

                    function trimText(text) {
                        if (text.length > 154) {
                            var newText = '';
                            for (var i = 0; i < 155; i++) {
                                newText += text[i];
                            }
                            newText += '...';
                            return newText;
                        }
                        return text;
                    }

                    var imageURL = item.image_url,
                        barName = item.name,
                        barRating = item.rating_img_url,
                        barSnippetText = trimText(item.snippet_text),
                        barID = item.id,
                        goingCount = 10;

                    function first(callback) {
                        User.findOne({
                            'goingCount.barID': barID
                        }, function(err, bar) {
                            if (err) {
                                return err;
                            }
                            if (bar) {
                                goingCount = bar.goingCount.goingCount;
                                count++;
                                callback();
                            }
                            else {
                                var newUser = new User();

                                newUser.goingCount.barID = barID;
                                newUser.goingCount.goingCount = 0;
                                goingCount = 0;

                                newUser.save(function(err) {
                                    if (err) {
                                        throw err;
                                    }
                                });
                                count++;
                                callback();
                            }
                        });
                    }

                    function sec() {
                        var imgDiv = '<div class="imgDiv"><a href=' + item.url + '><img class="barImg" src=' + imageURL + "></a></div>";
                        var barNameDiv = '<div class="barNameAndGoingContainer"><a href=' + item.url + '<span class="barName">' + '<b>' + barName + '</b>' + '</span></a><br>';
                        var barRatingDiv = '<img class="barRating" src=' + barRating + '><br><div' + '><button class="going" id=' + item.id + '>' + goingCount + ' GOING</button></div></div>';
                        var barSnippetTextDiv = '<span class="barSnippetText">' + '<i>' + barSnippetText + '</i>' + '</span>';

                        body += '<div class="col-lg-3">' + imgDiv + barNameDiv + barRatingDiv + barSnippetTextDiv + '</div>';

                        if (count % 4 == 0) {
                            barsDiv += '<div class="row">' + body + '</div>';
                            body = "";
                        }

                        if (count == data.businesses.length) {
                            res.end(barsDiv);
                        }
                    }

                    first(sec);
                });
            })
            .catch(function(err) {
                console.error(err);
            });
    };

    this.iAmGoing = function(req, res) {
        var barID = req.url.match(/\/iAmGoing\/(.*)/)[1];
        var goingCount = '';

        User.findOne({
            'twitter.id': req.user.twitter.id
        }, function(err, user) {
            if (err) {
                return err;
            }
            if (user) {
                var barsToGo = user.twitter.barsToGo;

                if (barsToGo.indexOf(barID) > -1) {

                    barsToGo.splice(barsToGo.indexOf(barID), 1);

                    User.findOneAndUpdate({
                        'twitter.id': req.user.twitter.id
                    }, {
                        $set: {
                            'twitter.barsToGo': barsToGo
                        }
                    }, {
                        new: true
                    }, function(err, result) {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }

                    });

                    User.findOneAndUpdate({
                        'goingCount.barID': barID
                    }, {
                        $inc: {
                            'goingCount.goingCount': -1
                        }
                    }, {
                        new: true
                    }, function(err, result) {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                        goingCount = JSON.stringify(result.goingCount.goingCount);
                        res.end(goingCount);
                    });


                }
                else {

                    barsToGo.push(barID);

                    User.findOneAndUpdate({
                        'goingCount.barID': barID
                    }, {
                        $inc: {
                            'goingCount.goingCount': 1
                        }
                    }, {
                        new: true
                    }, function(err, result) {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                        goingCount = JSON.stringify(result.goingCount.goingCount);
                        res.end(goingCount);
                    });

                    User.findOneAndUpdate({
                        'twitter.id': req.user.twitter.id
                    }, {
                        $set: {
                            'twitter.barsToGo': barsToGo
                        }
                    }, {
                        new: true
                    }, function(err, result) {
                        if (err) {
                            console.log("Something wrong when updating data!");
                        }
                    });

                }
            }
        });




    };

    this.iAmGoingLoggedIn = function(req, res) {
    };

    this.ifLoggedIn = function(req, res) {
        if (req.isAuthenticated()) {
            res.end('y');
        }
        else {
            res.end('n');
        }
    };
}

module.exports = ClickHandler;
