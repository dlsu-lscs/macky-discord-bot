const remove_md = require("remove-markdown");

const curtime = Date.now() / 1000;

const truncate = (string, max) => {
    if (string.length > max) {
        return string.slice(0, max) + "\u2026";
    } else {
        return string;
    }
};

const get_reddit_posts = async (minutes) => {
    const url = `https://oauth.reddit.com/r/${process.env.SUBREDDIT_NAME}/new`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": process.env.REDDIT_USER_AGENT,
                Authorization: process.env.REDDIT_AUTHORIZATION,
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        return json.data.children
            .filter((x) => curtime - x.data.created_utc < minutes * 60)
            .map((x) => {
                return {
                    title: x.data.title,
                    author: x.data.author,

                    created: x.created_utc,
                    link: "https://reddit.com" + x.data.permalink,
                    ...(x.data.post_hint == "image" && { image: x.data.url }),
                    ...(x.data.selftext && {
                        content: truncate(
                            remove_md(x.data.selftext)
                                .replace(/https?:\/\/\S+/g, "")
                                .trim(),
                            60
                        ),
                    }),
                };
            });
    } catch (error) {
        console.error(error.message);
    }
};

module.exports = get_reddit_posts;
