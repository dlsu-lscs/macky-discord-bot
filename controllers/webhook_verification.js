/**
 * Handles verification requests from Facebook's Graph API.
 *
 * @param {*} req Request object
 * @param {*} res Response object
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
 */
const webhook_verification = (req, res) => {
    // Ensure the verify token is correct
    if (req.query["hub.verify_token"] == process.env.WEBHOOK_VERIFY_TOKEN) {
        // Respond with the challenge value
        res.status(200).send(req.query["hub.challenge"]);
        console.log(req.query);
    } else {
        // Bad request
        res.status(400).send();
    }
};

module.exports = webhook_verification;
