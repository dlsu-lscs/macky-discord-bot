const { EmbedBuilder } = require("discord.js");

/**
 * Handles event notification requests from Facebook's Graph API.
 *
 * @param {*} req Request object
 * @param {*} res Response object
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications
 */
const webhook_notification = (req, res) => {
    const channel = req.discord_client.channels.cache.get(
        "1150781313532559404"
    );
    let entries = req.body.entry;

    // Iterate over each entry
    for (let entry of entries) {
        // Iterate over each change
        for (let change of entry.changes) {
            // Embed
            let embed = new EmbedBuilder()
                .setTitle(`${change.value.from.name} made a new post`)
                .setURL(`https://facebook.com/${entry.id}`)
                .setFooter({
                    text: new Date(entry.time * 1000).toLocaleTimeString(
                        "en-PH"
                    ),
                });

            // Set description iff message field exists
            if (Object.hasOwn(change.value, "message")) {
                embed = embed.setDescription(change.value.message);
            }

            // The field for one image and multiple images in the requests are different
            let images = [];
            if (Object.hasOwn(change.value, "link")) {
                console.log("HAS LINK");
                embed.setImage(change.value.link);
            } else if (Object.hasOwn(change.value, "photos")) {
                console.log("HAS PHOTOS");
                for (let photo of change.value.photos) {
                    console.log(photo);
                    images.push(
                        new EmbedBuilder()
                            .setImage(photo)
                            .setURL(`https://facebook.com/${entry.id}`)
                    );
                }
            }

            // Send the message
            channel.send({ embeds: [embed].concat(images) });

            // TODO: Error handling
            res.status(200).send();
        }
    }
};

module.exports = webhook_notification;
