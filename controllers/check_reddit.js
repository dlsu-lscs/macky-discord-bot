const { EmbedBuilder } = require("discord.js");
const get_reddit_posts = require("../utils/get_reddit_posts");

const check_reddit = async (bot) => {
    console.log(bot.channels.cache);
    const channel = bot.channels.cache.get(process.env.CHANNEL_ID_REDDIT);

    const posts = await get_reddit_posts(5);
    console.log(posts);

    for (let post of posts) {
        let embed = new EmbedBuilder()
            .setTitle(post.title)
            .setURL(post.link)
            .setThumbnail("https://i.imgur.com/jVdfC7o.png")
            .setColor("#abd8ff")
            .setFooter({
                text:
                    `Posted by u/${post.author} on r/${process.env.SUBREDDIT_NAME}` +
                    new Date(post.created).toLocaleTimeString(process.env.TIME_LOCALE) +
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
            content: "Test",
            embeds: [embed],
        });
    }
};

module.exports = check_reddit;
