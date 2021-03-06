var mysql = require('mysql');
var steem = require('steem');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

const blacklist = ['nemesio','rimavera','benture','tiagosare','teodera',
'mioteo','tristana','urbanot','sulinare','nesave','segundod','rufinac',
'nannie','sebelita','chakwaina','daunte','lisanove','mudenate','adabella',
'kantiago','sancha','nivera','atividad','narcisco' , 'tenegrore', 'enserrat', 
'odeste', 'rabella','lagritos','senlagra','dardonat','reanuelo','faitea','carenama','modeste',
'jeraldo','javiera','josefinaf','joakina','josune','jeraldo','jeraldo','gabrieldat','missvlada',
'tumblrykid','coppercoins','lakedamon','lancita','countonyou','godofredo','desiderio','inmaculadat','belisama',
'makhaon','mitrain','atividade','tihania','benedito','hermelinda','lonewolfahat','ignacia',
'melhemi42','isandro','garbine','piridion','analeigh','onofrete','quidea','kasif','aciencia','kalmira','herfecta',
'eyeserhe','epione','jaimica','carminda','jaione','isidoro','gualterio','inocencio','henriqua','glivana','aralyno','felisaleo',
'anbessa','eleanora','fundition.help','tecire','jerseymikes','fiveguys','redlobster','chick-fil-a','bonefish','chilis',
'olive-garden','dealmoon','nozuonodie','roy-rogers','mitbbs','wenxuecity','huaren','teamcn','lifetimevoting','teamcn-fund',
'teamcn-weekly','teamcn-news','cn-doctors','cn-health','teamcn-shop','cn-activity','cn-curation']

function isBlacklisted(string) {
    if(blacklist.includes(string))
    return true
    else return false
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function getRandomReward() {
    var rnd = 0
    rnd = getRandomInt(100)
    console.log("reward " + rnd)
    if (rnd > 99) {
        return 10
    }
    if (rnd > 95) {
        return 8
    }
    if (rnd > 87) {
        return 5
    }
    if (rnd > 71) {
        return 3
    }
    else {
        return 1
    }
}

function getReward(day) {
    var multiplicateur = 1;
    switch (day) {
        case 1:
            multiplicateur = 1
            break;
        case 2:
            multiplicateur = 5
            break;
        case 3:
            multiplicateur = 10
            break;
        case 4:
            multiplicateur = 25
            break;
        case 5:
            multiplicateur = 50
            break;
        case 6:
            multiplicateur = 75
            break;
        case 7:
            multiplicateur = 100
            break;
        default:
            multiplicateur = 1
    }
    return parseFloat((multiplicateur / 1000) * getRandomReward()).toFixed(3)
}

const gift_handler = {
    createNewGift: function (json, cb) {
        //INSERT USER 
        var user = json.name
        var date = json.date
        
        console.log("User : " + user + " will be verified");
        if(isBlacklisted(user))
        {
            steem.broadcast.transfer(process.env.STEEM_PASS, 'fundition', user, '0.001 STEEM', 'Bots are not authorized to claim a daily chest on Fundition.io! If you are a human you can be whitelisted by joining our discord here : https://discord.me/fundition', function (err, result) {
                if (err)
                    console.log(err, result);
            });
            console.log("Is it a bot? " + user)
            return cb(null)
        }
        else 
        pool.getConnection(function (err, connection) {
            var query = "SELECT * FROM gift WHERE username='" + user + "'"
            connection.query(query, function (err, result) {
                if (err) console.log(error);
                else {
                    //RECUPERATE USER ACTUAL GIFT
                    if (result.length >= 1) {
                        //CHECK IF ITS ALREADY 6 DAY AND RESET GIFT
                        var chest = result[0].chest
                        var lastday = new Date(result[0].date)
                        var zz = lastday.getUTCDate();
                        var ff = lastday.getUTCMonth() + 1; //January is 0!
                        var tttt = lastday.getUTCFullYear();
                        if (zz < 10) {
                            zz = '0' + zz
                        }
                        if (ff < 10) {
                            ff = '0' + ff
                        }
                        lastday = tttt + '/' + ff + '/' + zz;

                        var today = new Date()
                        var dd = today.getUTCDate();
                        var mm = today.getUTCMonth() + 1; //January is 0!
                        var yyyy = today.getUTCFullYear();
                        var hhhh = today.getUTCHours()
                        var mmmm = today.getUTCMinutes()
                        var ssss = today.getUTCSeconds()
                        today = yyyy + '/' + mm + '/' + dd;
                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }
                        today = yyyy + '/' + mm + '/' + dd + ' ' + hhhh + ':' + mmmm + ':' + ssss;
                        if (zz === dd && mm === ff) {
                            console.log('same day for ' + user)
                            connection.release();
                            return cb(null)
                        }
                        else if (result[0].day > 6) {
                            if (zz === dd && mm === ff) {
                                console.log('same day for ' + user)
                                connection.release();
                                cb(null)
                            }
                            else {
                                console.log("7 days GG")
                                chest = chest + 20
                                var reward = getReward(result[0].day)
                                var query = "UPDATE gift SET day=1 , date='" + today + "', chest='" + chest + "' WHERE username='" + user + "'"
                                connection.query(query, function (err, result) {
                                    if (err) throw err;
                                    else {
                                        steem.broadcast.transfer(process.env.STEEM_PASS, 'fundition', user, reward + ' STEEM', 'Your reward for claiming your daily chest on Fundition.io!', function (err, result) {
                                            if (err)
                                                console.log(err, result);
                                        });
                                        console.log("Days reset for user" + user)
                                        connection.release();
                                        cb(null)
                                    }
                                })
                            }
                        }
                        else if (zz != dd - 1) {
                            console.log("reseting days")

                            chest = chest+5
                            var reward =  getReward(1)
                            var query = "UPDATE gift SET day=2 , date='" + today + "', chest='" + chest + "' WHERE username='" + user + "'"
                            connection.query(query, function (err, result) {
                                if (err) throw err;
                                else {
                                    steem.broadcast.transfer(process.env.STEEM_PASS, 'fundition', user, reward + ' STEEM', 'Your reward for claiming your daily chest on Fundition.io!', function (err, result) {
                                        if (err)
                                            console.log(err, result);
                                    });
                                    console.log("Days reset for user" + user)
                                    connection.release();
                                    return cb(null)
                                }
                            })
                        }

                        else {
                            var newday = parseFloat(result[0].day + 1)
                            console.log('updating days')
                            var reward = getReward(result[0].day)
                            chest = chest + 5
                            var query = "UPDATE gift SET day=" + newday + ", date='" + today + "', chest='" + chest + "' WHERE gift_id=" + result[0].gift_id
                            connection.query(query, function (err, result) {
                                if (err) throw err;
                                else {
                                    steem.broadcast.transfer(process.env.STEEM_PASS, 'fundition', user, reward + ' STEEM', 'Your reward for claiming your daily chest on Fundition.io!', function (err, result) {
                                        if (err)
                                            console.log(err, result);
                                    });
                                    console.log("Day added to user" + user)
                                    cb(null)
                                }
                            })
                        }
                    }
                    else {
                        var today = new Date()
                        var dd = today.getUTCDate();
                        var mm = today.getUTCMonth() + 1; //January is 0!
                        var yyyy = today.getUTCFullYear();
                        var hhhh = today.getUTCHours()
                        var mmmm = today.getUTCMinutes()
                        var ssss = today.getUTCSeconds()
                        today = yyyy + '/' + mm + '/' + dd;
                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }
                        today = yyyy + '/' + mm + '/' + dd + ' ' + hhhh + ':' + mmmm + ':' + ssss;
                        console.log('no result')
                        var query = "INSERT INTO gift (username, day, date, chest) VALUES ('" + user + "','2','" + today + "','5')";
                        connection.query(query, function (err, result) {
                            if (err) console.log(err);
                            else {
                                console.log('inserted')
                                var reward = getReward(1)
                                steem.broadcast.transfer(process.env.STEEM_PASS, 'fundition', user, reward + ' STEEM', 'Your reward for claiming your daily chest on Fundition.io!', function (err, result) {
                                    if (err)
                                    console.log(err, result);
                                });
                                connection.release();
                                cb(null)
                            }
                        })
                    }

                }
            })
        })
    }
}
module.exports = gift_handler;