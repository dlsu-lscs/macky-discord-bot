const express = require("express");
const app = express();
const check_reddit = require("../controllers/check_reddit");

module.exports = {
    name: "ready",
    once: true,
    execute(bot) {
        //Log Bot's username and the amount of servers its in to console
        console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} servers!`);

        //Set the Presence of the bot user
        bot.user.setPresence({ activities: [{ name: "Animo, La Salle!" }] });
        const passBotInstance = (req, res, next) => {
            req.discord_client = bot;
            next();
        };

        app.use(express.json());

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT}`);
        });

        // Verify
        app.get("/verify/:id", passBotInstance, require("../controllers/verify"));

        // Facebook webhooks
        app.get("/webhooks", passBotInstance, require("../controllers/webhook_verification"));
        app.post("/webhooks", passBotInstance, require("../controllers/webhook_notification"));

        check_reddit(bot);
        setInterval(() => {
            check_reddit(bot).catch(console.error);
        }, 60000 * process.env.REDDIT_INTERVAL_MINS);
    },
};

// https://d9c6-175-176-39-176.ngrok-free.app/webhooks
