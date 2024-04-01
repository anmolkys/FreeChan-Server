const redis = require("redis")

const client = async() => {const client = redis.createClient(5050); return client}

module.exports = client