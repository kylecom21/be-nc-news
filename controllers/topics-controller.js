const { fetchTopics } = require("../models/topics-model");

function getTopics(request, response) {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
}

module.exports = { getTopics };
