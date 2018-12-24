var mysql = require('mysql');
var steem = require('steem');

var pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});
var jsonMetadata = [{ app: 'ongame' }]
var simplevotemessage = `<p></p> Your post received a small upvote from @ongame as incentive for sharing gaming content.
<p></p>
Want to know more about Ongame.io ? <a href="https://discord.me/ongame">Join us now!</a></br>
- All Recent Games (More than 70k) 
- Live Stream & external sources
- Review Games and get rewarded
- And many more... !!!
`
var simplemessage = `<p></p>
Do you know Ongame.io ? The first gaming platform built over blockchain!<p></p> <a href="https://discord.me/ongame">Join us now!</a></br>
- All Recent Games (More than 70k) 
- Live Stream & external sources
- Review Games and get rewarded
- And many more... !!!
`

const ongame_handler = {
    insertItem: function (content, cb) {
        var query = `INSERT INTO ongamecontents (author,permlink,title, created, body, json_metadata, game, last_update, type ) 
        VALUES ('${content.author}','${content.permlink}','${content.title}','${content.created}','${content.body}', '${content.json_metadata}','${content.game}','${content.last_update}','${content.type}')
        ON DUPLICATE KEY UPDATE  title='${content.title}', body='${content.body}', json_metadata='${content.json_metadata}',game='${content.game}', last_update='${content.last_update}', type='${content.type}'`
        pool.getConnection(function (error, connection) {
            connection.query(query, function (err, result) {
                if (err) {
                    console.log(err)
                    cb(err);
                    connection.release();
                }
                else
                    console.log('ongame content inserted')
                connection.release();
                cb(null)
            })
        })
    },
    parseContent: function (post) {
        var content = {}
        content.author = post.author
        content.permlink = post.permlink
        content.title = post.title.toString().replace(/\'/g, "''")
        content.body = post.body.toString().replace(/\'/g, "''")
        var today = new Date()
        var dd = today.getUTCDate();
        var mm = today.getUTCMonth() + 1;
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
        content.created = today
        content.last_update = today
        content.tags = post.json_metadata.tags
        for (i = 0; content.tags.length > i; i++) {
            if (content.tags[i].includes('ongame-news') || content.tags[i].includes('ongame-streaming') || content.tags[i].includes('ongame-video')
                || content.tags[i].includes('ongame-screenshot') || content.tags[i].includes('ongame-review') || content.tags[i].includes('ongame-tips')) {
                content.type = content.tags[i].split('-')[1]
            }
            else if (content.tags[i].includes('ongame-')) {
                content.game = content.tags[i].split('-')[1]
            }
        }
        try {
            content.json_metadata = JSON.stringify(post.json_metadata).toString().replace(/\'/g, "''")
        } catch (e) {
            console.log(e)
        }

        return content;
    },
    upvoteComment: function (json, cb) {
        steem.api.getAccounts(['ongame'], function (err, result) {
            if (result)
            var account = result[0]
            const totalShares = parseFloat(account.vesting_shares) + parseFloat(account.received_vesting_shares) - parseFloat(account.delegated_vesting_shares) - parseFloat(account.vesting_withdraw_rate);

            const elapsed = Math.floor(Date.now() / 1000) - account.voting_manabar.last_update_time;
            const maxMana = totalShares * 1000000;
            // 432000 sec = 5 days
            let currentMana = parseFloat(account.voting_manabar.current_mana) + elapsed * maxMana / 432000;

            if (currentMana > maxMana) {
                currentMana = maxMana;
            }

            const currentManaPerc = currentMana * 100 / maxMana;
            if(currentManaPerc>90)
            {
                steem.broadcast.vote(process.env.ONGAME_STEEM_POSTING_KEY, 'ongame', json.author, json.permlink, 2500, function (err, result) {
                    if (result) {
                        steem.broadcast.comment(process.env.ONGAME_STEEM_POSTING_KEY, json.author, json.permlink, 'ongame', json.permlink + 'ongame', 'ongame', 'Congratulations @' + json.author + ' !' + simplevotemessage, jsonMetadata, function (err, result) {
                            if (err)
                                return cb(true)
                            else
                                console.log('upvte+comm ok')
                            return cb(null)
                        });
                    }
                    else {
                        cb(true)
                    }
                });
            }
            else{
                steem.broadcast.comment(process.env.ONGAME_STEEM_POSTING_KEY, json.author, json.permlink, 'ongame', json.permlink + 'ongame', 'ongame', 'Hello @' + json.author + ' !' + simplemessage, jsonMetadata, function (err, result) {
                    if (err)
                        return cb(true)
                    else
                        console.log('comm ok')
                    return cb(null)
                });
            }
        });

    }
}
module.exports = ongame_handler;