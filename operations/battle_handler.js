const express = require('express');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});
var rpg_mode = require('./battle/rpg_mode')
rpg_mode = new rpg_mode();

function StartNewBattle(player_id, cb) {
    pool.getConnection(function (err, connection) {
        var query = "INSERT INTO battle (battle_player_one_id) VALUES (" + player_id + ")"
        connection.query(query, function (err, result) {
            if (err) console.log(err);
            else {
                console.log("User : " + player_id + " Started a new battle")
                connection.release();
                cb(null)
            }
        })
    })
}

function ResolveBattle(battle_id, cb) {
    pool.getConnection(function (err, connection) {
        var query = "SELECT * FROM battle WHERE battle_id=" + battle_id
        connection.query(query, function (err, result) {
            if (err) console.log(err);
            else {
                rpg_mode.createCharacter('player_1', result[0].battle_player_one_id, 'King');
                rpg_mode.createCharacter('player_2', result[0].battle_player_two_id, 'Slave');
                rpg_mode.startBattle(rpg_mode.characters, function (battle_result) {
                    if (battle_result) {
                        if (battle_result.winner_id = result[0].battle_player_one_id)
                            battle_result.battle_looser_id = result[0].battle_player_two_id
                        else
                            battle_result.battle_looser_id = result[0].battle_player_one_id
                        var query = "INSERT INTO battle_history (battle_id,battle_result,battle_winner_id,battle_looser_id) VALUES (" + battle_id + ",'" + battle_result.result + "'," + battle_result.winner_id + "," + battle_result.battle_looser_id + ")"
                        connection.query(query, function (err, result) {
                            if (err) cb(err);
                            else {
                                var query = "DELETE FROM battle WHERE battle_id=" + battle_id
                                connection.query(query, function (err, result) {
                                    if (err) cb(err);
                                    else {
                                        cb(null)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })
}



function checkFreeBattle(player_id, battles) {
    for (i = 0; battles.length > i; i++) {
        if (battles[i].battle_player_one_id != player_id && battles[i].battle_player_two_id != player_id)
            return battles[i]
    }
    return false
}

const battle_handler = {
    checkForABattle: function (player_id,cb) {
        if (battle_id > 0) {
            JoinBattle(player_id, battle_id, function (error) {
                if (error)
                    console.log(error)
            })
        }
    },
    JoinBattle:function (player_id, battle_id, cb) {
        pool.getConnection(function (err, connection) {
            var query = "UPDATE battle SET battle_player_two_id=" + player_id + " WHERE battle_id=" + battle_id
            connection.query(query, function (err, result) {
                if (err) cb(true);
                else {
                    console.log("User : " + player_id + " joined battle " + battle_id)
                    ResolveBattle(battle_id, function (error) {
                        if (error)
                            console.log(error)
                        else {
                            connection.release();
                            console.log("Battle " + battle_id + " solved")
                            cb(null)
                        }
                    })
    
                }
            })
        })
    }
}

//   //INSERT USER 
//   pool.getConnection(function (err, connection) {
//     var query = "SELECT * FROM user WHERE user_id='" + player_id + "'"
//     connection.query(query, function (err, result) {
//         if (err) console.log(err);
//         else {
//             var query = "SELECT * FROM battle"
//             connection.query(query, function (err, result) {
//                 if (err) console.log(err);
//                 else {
//                     if (result.length > 0) {
//                         if (checkFreeBattle(player_id, result, function (error) {
//                             if (error)
//                                 console.log(error)
//                             else {
//                                 var battle_to_join = checkFreeBattle(player_id, result)
//                                 JoinBattle(player_id, battle_to_join.battle_id, function (error) {
//                                     if (error)
//                                         console.log(error)
//                                 })
//                             }
//                         })) {
//                         }
//                         else {
//                             console.log('There is no available battle')
//                             StartNewBattle(player_id, function (error) {
//                                 if (error)
//                                     console.log(error)
//                             })
//                         }
//                     }
//                     else {
//                         console.log('There is no battle')
//                         StartNewBattle(player_id, function (error) {
//                             if (error)
//                                 console.log(error)
//                         })
//                     }
//                 }
//             })
//         }
//     })
// })



module.exports = battle_handler;