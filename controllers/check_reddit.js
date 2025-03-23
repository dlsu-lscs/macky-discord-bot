const { EmbedBuilder } = require("discord.js");
const get_reddit_posts = require("../utils/get_reddit_posts");

const check_reddit = async (bot) => {
    const channel = bot.channels.cache.get(process.env.CHANNEL_ID_REDDIT);

    const posts = await get_reddit_posts(process.env.REDDIT_INTERVAL_MINS);
    console.log(posts);

    for (let post of posts) {
        let embed = new EmbedBuilder()
            .setTitle(`r/${process.env.SUBREDDIT_NAME}: ${post.title}`)
            .setURL(post.link)
            .setThumbnail("https://i.imgur.com/jVdfC7o.png")
            .setColor("#abd8ff")
            .setFooter({
                text:
                    `Posted by u/${post.author} at ` +
                    new Date(post.created * 1000).toLocaleTimeString(process.env.TIMESTAMP_LOCALE, {
                        timeZone: "Asia/Brunei",
                    }) +
                    "\n39th La Salle Computer Society Research and Development",
                iconURL: "https://i.imgur.com/rrvsq8o.png",
            });

        // Set description iff message field exists
        if (Object.hasOwn(post, "content")) {
            embed = embed.setDescription(post.content);
        }

        // The field for one image and multiple images in the requests are different
        if (Object.hasOwn(post, "image")) {
            embed.setImage(post.image);
        }

        // TODO: Multiple images, not sure what that looks like
        channel.send({
            // content: {something here},
            embeds: [embed],
        });
    }
};

module.exports = check_reddit;
