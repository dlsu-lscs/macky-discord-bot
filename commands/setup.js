const { EmbedBuilder } = require('discord.js')
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const lscs = require('../utils/lscs')

module.exports = {
    config: {
        name: 'setup',
        description: 'Sets up the verification module.',
        usage: `!setup`,
    },
    async run(bot, message, args) {

        const embed = new EmbedBuilder()
            .setTitle("Verification")
            .setDescription("React with the check mark (✅) to begin verification!")
            .setThumbnail("https://i.imgur.com/jVdfC7o.png")
            .setColor("#abd8ff")
            .setFooter({
                text: "39th La Salle Computer Society Research and Development",
                iconURL: "https://i.imgur.com/rrvsq8o.png",
            });

        const verifyButton = new ButtonBuilder()
            .setCustomId('verify')        // A unique ID to identify the button interaction
            .setLabel('Verify')           // Text on the button
            .setEmoji('✅')               // Check mark emoji
            .setStyle(ButtonStyle.Primary); // Button style (Primary, Secondary, Danger, etc.)

        const row = new ActionRowBuilder()
            .addComponents(verifyButton);

        await message.channel.send({
            embeds: [embed],
            components: [row],   // Attach the button to the message
        });


        react_message = await message.channel.send({ embeds: [embed] });
        lscs.setVerifyMessage(react_message.id)
        // await react_message.react('✅');
    }
}
