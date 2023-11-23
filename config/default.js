require('dotenv').config(); // loads .env file to process

module.exports = {
    kafka: {
        brokers: ["localhost:9093"],
        group: "poc-group-app",
        topics: {
            messageBus: "message-bus-microservices-poc-topic",
        }
    },
}