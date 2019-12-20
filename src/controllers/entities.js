const elasticsearch = require('./elasticsearch');

module.exports = {
    async suggest(req, res) {
        let result = await elasticsearch.getSuggestions(req.query.q, req.query.size);
        return res.status(200).json(result);
    }
}
