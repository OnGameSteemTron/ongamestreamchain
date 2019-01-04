var steem = require('steem');
steem.api.setOptions({ url: 'https://api.steemit.com' });
var jsonMetadata = [{ app: 'fundition' }]

var updatevotemessage = `<center>
**This project is being supported by @Fundition the next-generation, decentralized, peer-to-peer crowdfunding and collaboration platform, built on the Steem blockchain.**
<sub>
Read the full details of [Fundition Fund program](https://fundition.io/#!/fundprogram)
Learn more about Fundition by reading our [purplepaper](https://purplepaper.fundition.io) 
![work_on_progess.gif](https://cdn.steemitimages.com/DQmPAr9Mt1ZxrDsTVUguWMoLjTjBnHB7Y7CMMxngAgPUGsY/work_on_progess.gif)

<a href="https://steemit.com/@fundition">![steemitf.png](https://cdn.steemitimages.com/DQmX3cy15dCdj13UHEXJweXi56Ke7wPygVATXTn9M4nJXnP/steemitf.png)</a><a href="https://twitter.com/funditionio">![twitterf.png](https://cdn.steemitimages.com/DQmNpvrZZwovgVjvFzECahb1Rxn3DHW44qQRR6ezKaW5tZm/twitterf.png)</a><a href="https://www.youtube.com/c/Funditionio">![youtubef.png](https://cdn.steemitimages.com/DQmb4sujNswmgi3U9HMZhPrzewtnBiq4h2meN2GTGHFncZs/youtubef.png)</a><a href="https://facebook.com/funditionio">![facebookf.png](https://cdn.steemitimages.com/DQmY4Uc6ocy3pf5743kevVwY8vSta8s1AZEyXnRaQKRuE8P/facebookf.png)</a><a href="https://www.instagram.com/funditionio/">![instaf.png](https://cdn.steemitimages.com/DQmNSCP9MBQ6ND6nEJM7Tw3tHAHSqeXpUpspaoA9BVSSVqd/instaf.png)</a><a href="https://discord.me/fundition">![discordf.png](https://cdn.steemitimages.com/DQmSxkY56B9RZWXmhUyybUR7ZtsJAf2BHHyH2pGoFLLRaH2/discordf.png)</a>
<a href="https://fundition.io">**Join a community with heart based giving at its core**</a></sub></center>
Fundition is a non profit project, by supporting it with delegation you are supporting 200+ projects.
<b><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=50%20SP" >50SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=100%20SP" >100SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=200%20SP" >200SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=500%20SP" >500SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=1000%20SP" >1000SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=2000%20SP" >2000SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=5000%20SP" >5000SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=10000%20SP" >10000SP</a></b>
`

var simplevotemessage = `<center>
**Thank you for being a loyal Funditian and helping spread the voice of Fundition all around, we really appreciate your efforts to try and promote Fundition. As a token of our gratitude, please accept this upvote from us. Take care and keep spreading the word about Fundition whenever you can, so, we can grow and help as many people as possible.**
<sub>
Read the full details of [Fundition Fund program](https://fundition.io/#!/fundprogram)
Learn more about Fundition by reading our [purplepaper](https://purplepaper.fundition.io) 
![work_on_progess.gif](https://cdn.steemitimages.com/DQmPAr9Mt1ZxrDsTVUguWMoLjTjBnHB7Y7CMMxngAgPUGsY/work_on_progess.gif)

<a href="https://steemit.com/@fundition">![steemitf.png](https://cdn.steemitimages.com/DQmX3cy15dCdj13UHEXJweXi56Ke7wPygVATXTn9M4nJXnP/steemitf.png)</a><a href="https://twitter.com/funditionio">![twitterf.png](https://cdn.steemitimages.com/DQmNpvrZZwovgVjvFzECahb1Rxn3DHW44qQRR6ezKaW5tZm/twitterf.png)</a><a href="https://www.youtube.com/c/Funditionio">![youtubef.png](https://cdn.steemitimages.com/DQmb4sujNswmgi3U9HMZhPrzewtnBiq4h2meN2GTGHFncZs/youtubef.png)</a><a href="https://facebook.com/funditionio">![facebookf.png](https://cdn.steemitimages.com/DQmY4Uc6ocy3pf5743kevVwY8vSta8s1AZEyXnRaQKRuE8P/facebookf.png)</a><a href="https://www.instagram.com/funditionio/">![instaf.png](https://cdn.steemitimages.com/DQmNSCP9MBQ6ND6nEJM7Tw3tHAHSqeXpUpspaoA9BVSSVqd/instaf.png)</a><a href="https://discord.me/fundition">![discordf.png](https://cdn.steemitimages.com/DQmSxkY56B9RZWXmhUyybUR7ZtsJAf2BHHyH2pGoFLLRaH2/discordf.png)</a>
<a href="https://fundition.io">**Join a community with heart based giving at its core**</a></sub></center>
Fundition is a non profit project, by supporting it with delegation you are supporting 200+ projects.
<b><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=50%20SP" >50SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=100%20SP" >100SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=200%20SP" >200SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=500%20SP" >500SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=1000%20SP" >1000SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=2000%20SP" >2000SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=5000%20SP" >5000SP</a><a href="https://v2.steemconnect.com/sign/delegateVestingShares?delegator=&amp;delegatee=fundition&amp;vesting_shares=10000%20SP" >10000SP</a></b>
`


const fundition_handler = {
    upvoteComment: function (json, cb) {
        steem.api.getContent(json.author, json.permlink, function (error, result) {
            if (result) {
                var newpost = {}
                try {
                    newpost.json_metadata = JSON.parse(result.json_metadata)
                    for (b = 0; newpost.json_metadata.tags.length > b; b++) {
                        if (newpost.json_metadata.tags[b].includes('fundition-')) {
                            console.log('update vote')
                            steem.broadcast.comment(process.env.STEEM_POSTING_KEY, json.author, json.permlink, 'fundition', json.permlink + 'fundition', 'Fundition', updatevotemessage, jsonMetadata, function (err, result) {
                                console.log(err, result);
                                if (err)
                                    return cb(true)
                                else
                                    console.log(result)
                                return cb(null)
                            });
                        }
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
                } catch (e) {
                    console.log(e)
                }

            }
            else {
                cb(null)
            }
        })
    }
}
module.exports = fundition_handler;