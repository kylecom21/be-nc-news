const { fetchTopics } = require("../models/topics-model");
const endpoints = require("../endpoints.json")

function getTopics(request, response) {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
}

function getEndpoints(request,response,) {
    response.status(200).send({endpoints})
}

module.exports = { getTopics , getEndpoints };
