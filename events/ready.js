const express = require("express");
const app = express();

module.exports = {
    name: "ready",
    once: true,
    execute(bot) {
        //Log Bot's username and the amount of servers its in to console
        console.log(
            `${bot.user.username} is online on ${bot.guilds.cache.size} servers!`
        );

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
        app.get(
            "/verify/:id",
            passBotInstance,
            require("../controllers/verify")
        );

        // Facebook webhooks
        app.get(
            "/webhooks",
            passBotInstance,
            require("../controllers/webhook_verification")
        );
        app.post(
            "/webhooks",
            passBotInstance,
            require("../controllers/webhook_notification")
        );
    },
};

// https://d9c6-175-176-39-176.ngrok-free.app/webhooks
