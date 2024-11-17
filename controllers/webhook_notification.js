const { EmbedBuilder } = require("discord.js");

/**
 * Handles event notification requests from Facebook's Graph API.
 *
 * @param {*} req Request object
 * @param {*} res Response object
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications
 */
const webhook_notification = (req, res) => {
    const guild = req.discord_client.guilds.cache.get(process.env.GUILD_ID);
    const channel = guild.channels.cache
        // I don't know how Discord sorts channels
        // See https://stackoverflow.com/a/76782585 for a possible solution
        .sort((a, b) => a.rawPosition > b.rawPosition)
        // As far as I know find() will stop at the first match
        .find(
            (c) =>
                guild.members.me.permissionsIn(c.id).has("SEND_MESSAGES") &&
                c.type == 0
        );

    // Alternative: Get a channel specifically by channel ID
    // Might be better if Macky won't ever be added to other servers
    // req.discord_client.channels.cache.get(process.env.CHANNEL_ID);

    // TODO: Verify SHA256 signature in payload

    // Status response code
    let status = 200;

    // Iterate over each entry
    let entries = req.body.entry;
    search: for (let entry of entries) {
        // Iterate over each change
        for (let change of entry.changes) {
            // Only accept "feed" updates
            if (change.field != "feed") {
                console.log(
                    `[Webhooks] Error: attempted to parse "${change.field}" update`
                );
                status = 400;
                break search;
            }

            // Embed
            let embed = new EmbedBuilder()
                .setTitle(`${change.value.from.name} made a new post`)
                .setURL(`https://facebook.com/${change.value.post_id}`)
                .setFooter({
                    text: new Date(entry.time * 1000).toLocaleTimeString(
                        process.env.TIME_LOCALE
                    ),
                });

            // Set description iff message field exists
            if (Object.hasOwn(change.value, "message")) {
                embed = embed.setDescription(change.value.message);
            }

            // The field for one image and multiple images in the requests are different
            if (Object.hasOwn(change.value, "link")) {
                embed.setImage(change.value.link);
            } else if (Object.hasOwn(change.value, "photos")) {
                // Only show first image
                embed.setImage(change.value.photos[0]);
            }

            console.log(
                `[Webhooks] Received "${change.field}" update (https://facebook.com/${entry.id})`
            );

            // Send the message
            channel.send({
                embeds: [embed],
            });
        }
    }

    res.status(status).send();
};

module.exports = webhook_notification;
