require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
} = require("discord.js");

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.User,
        Partials.Reaction,
        Partials.GuildMember,
    ],
});

const fs = require("fs");
const check_reddit = require("./controllers/check_reddit");

bot.commands = new Collection();

const commandFiles = fs
    .readdirSync("./commands/")
    .filter((f) => f.endsWith(".js"));
for (const file of commandFiles) {
    const props = require(`./commands/${file}`);
    console.log(`command ${file} loaded`);
    bot.commands.set(props.config.name, props);
}

const commandSubFolders = fs
    .readdirSync("./commands/")
    .filter((f) => !f.endsWith(".js"));

commandSubFolders.forEach((folder) => {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}/`)
        .filter((f) => f.endsWith(".js"));
    for (const file of commandFiles) {
        const props = require(`./commands/${folder}/${file}`);
        console.log(`${file} loaded from ${folder}`);
        bot.commands.set(props.config.name, props);
    }
});

// Load Event files from events folder
const eventFiles = fs.readdirSync("./events/").filter((f) => f.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    console.log(`event ${file} loaded`);
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args, bot));
    } else {
        bot.on(event.name, (...args) => event.execute(...args, bot));
    }
}

//Command Manager
bot.on("messageCreate", async (message) => {
    // console.log(message);
    //Check if author is a bot or the message was sent in dms and return
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    //get prefix from config and prepare message so it can be read as a command
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    //Check for prefix
    if (!cmd.startsWith(process.env.PREFIX)) return;

    //Get the command from the commands collection and then if the command is found run the command file
    let commandfile = bot.commands.get(cmd.slice(process.env.PREFIX.length));
    if (commandfile) commandfile.run(bot, message, args);
});

bot.login(process.env.DISCORD_BOT_TOKEN).then(() => {
    console.log("[Macky] Beep boop, Hello world!");
});
