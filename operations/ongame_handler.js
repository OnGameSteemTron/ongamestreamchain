var mysql = require('mysql');
var steem = require('steem');

var pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

var simplevotemessage = `Your post received a small upvote from @ongame as incentive for sharing gaming content.
<p></p>
Want to know more about Ongame.io ? <a href="https://ongame.io">Join us now!</a>
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
        steem.broadcast.vote(process.env.ONGAME_STEEM_POSTING_KEY, 'ongame', json.author, json.permlink, 500, function(err, result) {
            if(result){
                steem.broadcast.comment(process.env.ONGAME_STEEM_POSTING_KEY, json.author, json.permlink, 'ongame', json.permlink + 'ongame', 'ongame', 'Congratulations @' + json.author + simplevotemessage, jsonMetadata, function (err, result) {
                    if (err)
                        return cb(true)
                    else
                        console.log('upvte+comm ok')
                    return cb(null)
                });
            }
            else{
                cb(true)
            }
          });
    }
}
module.exports = ongame_handler;