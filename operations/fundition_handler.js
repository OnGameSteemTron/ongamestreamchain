var mysql = require('mysql');
var steem = require('steem');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});


var jsonMetadata = [{ app: 'fundition' }]

var updatevotemessage = `**This project is being supported by @Fundition**

Fundition is a next-generation, decentralized, peer-to-peer crowdfunding and collaboration platform, built on the Steem blockchain.

#upfundition and #fundition tags on Steem represent the projects that are started on [https://fundition.io](https://fundition.io).

Are You Prepared to Make the World a Better Place too?

#### Read the full details of [Fundition Fund program](https://fundition.io/#!/fundprogram)
#### Learn more about Fundition by reading our [purplepaper](https://purplepaper.fundition.io) 

<center><sub>![work_on_progess.gif](https://cdn.steemitimages.com/DQmPAr9Mt1ZxrDsTVUguWMoLjTjBnHB7Y7CMMxngAgPUGsY/work_on_progess.gif)

<a href="https://steemit.com/@fundition">![steemitf.png](https://cdn.steemitimages.com/DQmX3cy15dCdj13UHEXJweXi56Ke7wPygVATXTn9M4nJXnP/steemitf.png)</a><a href="https://twitter.com/funditionio">![twitterf.png](https://cdn.steemitimages.com/DQmNpvrZZwovgVjvFzECahb1Rxn3DHW44qQRR6ezKaW5tZm/twitterf.png)</a><a href="https://www.youtube.com/c/Funditionio">![youtubef.png](https://cdn.steemitimages.com/DQmb4sujNswmgi3U9HMZhPrzewtnBiq4h2meN2GTGHFncZs/youtubef.png)</a><a href="https://facebook.com/funditionio">![facebookf.png](https://cdn.steemitimages.com/DQmY4Uc6ocy3pf5743kevVwY8vSta8s1AZEyXnRaQKRuE8P/facebookf.png)</a><a href="https://www.instagram.com/funditionio/">![instaf.png](https://cdn.steemitimages.com/DQmNSCP9MBQ6ND6nEJM7Tw3tHAHSqeXpUpspaoA9BVSSVqd/instaf.png)</a><a href="https://discord.me/fundition">![discordf.png](https://cdn.steemitimages.com/DQmSxkY56B9RZWXmhUyybUR7ZtsJAf2BHHyH2pGoFLLRaH2/discordf.png)</a>
<a href="https://fundition.io">**Join a community with heart based giving at its core**</a></sub></center>
`

var simplevotemessage = `<p></p>Thank you for being a loyal Funditian and helping spread the voice of Fundition all around, we really appreciate your efforts to try and promote Fundition. As a token of our gratitude, please accept this upvote from us. Take care and keep spreading the word about Fundition whenever you can, so, we can grow and help as many people as possible. We wish you all the best.

If you are reading this and you aren’t the author of this post, what are you waiting for, Join Fundition and let’s together make a change, a change that will make this World Better even Amazing!

Fundition is a next-generation, decentralized, peer-to-peer crowdfunding and collaboration platform, built on the Steem blockchain.

#### Read the full details of [Fundition Fund program](https://fundition.io/#!/fundprogram)
#### Learn more about Fundition by reading our [purplepaper](https://purplepaper.fundition.io)

<center><sub>![work_on_progess.gif](https://cdn.steemitimages.com/DQmPAr9Mt1ZxrDsTVUguWMoLjTjBnHB7Y7CMMxngAgPUGsY/work_on_progess.gif)

<a href="https://steemit.com/@fundition">![steemitf.png](https://cdn.steemitimages.com/DQmX3cy15dCdj13UHEXJweXi56Ke7wPygVATXTn9M4nJXnP/steemitf.png)</a><a href="https://twitter.com/funditionio">![twitterf.png](https://cdn.steemitimages.com/DQmNpvrZZwovgVjvFzECahb1Rxn3DHW44qQRR6ezKaW5tZm/twitterf.png)</a><a href="https://www.youtube.com/c/Funditionio">![youtubef.png](https://cdn.steemitimages.com/DQmb4sujNswmgi3U9HMZhPrzewtnBiq4h2meN2GTGHFncZs/youtubef.png)</a><a href="https://facebook.com/funditionio">![facebookf.png](https://cdn.steemitimages.com/DQmY4Uc6ocy3pf5743kevVwY8vSta8s1AZEyXnRaQKRuE8P/facebookf.png)</a><a href="https://www.instagram.com/funditionio/">![instaf.png](https://cdn.steemitimages.com/DQmNSCP9MBQ6ND6nEJM7Tw3tHAHSqeXpUpspaoA9BVSSVqd/instaf.png)</a><a href="https://discord.me/fundition">![discordf.png](https://cdn.steemitimages.com/DQmSxkY56B9RZWXmhUyybUR7ZtsJAf2BHHyH2pGoFLLRaH2/discordf.png)</a>
<a href="https://fundition.io">**Join a community with heart based giving at its core**</a></sub></center>
`


const fundition_handler = {
    upvoteComment: function (json, cb) {
        steem.api.getContent(json.author, json.permlink, function (error, result) {
            if (result) {
                try {
                    var newpost = {}
                    newpost.json_metadata = JSON.parse(result.json_metadata)
                } catch (e) {
                    console.log(e)
                }
                for (b = 0; newpost.json_metadata.tags.length > b; b++) {
                    if (newpost.json_metadata.tags[b].includes('fundition-')) {
                        steem.broadcast.comment(process.env.STEEM_POSTING_KEY, json.author, json.permlink, 'fundition', json.permlink + 'fundition', 'Fundition', updatevotemessage, jsonMetadata, function (err, result) {
                            console.log(err, result);
                            if (err)
                                return cb(true)
                            else
                                console.log(result)
                            return cb(null)
                        });
                        if (newpost.json_metadata.tags.length === b) {
                            console.log('simple vote')
                            steem.broadcast.comment(process.env.STEEM_POSTING_KEY, json.author, json.permlink, 'fundition', json.permlink + 'fundition', 'Fundition', 'Thank you @' + json.author + simplevotemessage, jsonMetadata, function (err, result) {
                                console.log(err, result);
                                if (err)
                                    return cb(true)
                                else
                                    console.log(result)
                                return cb(null)
                            });
                        }
                    }
                }
            }
            else {
                cb(null)
            }
        })


    }
}
module.exports = fundition_handler;