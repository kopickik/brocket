const twitterService = require('./twitter');

module.exports = (req, res) => {
    twitterService(req.params.username)
        .then(profile => res.send(profile.userName))
        .catch(err => res.send('Error: ', err));
};