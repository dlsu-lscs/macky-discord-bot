const lscs = require('../utils/lscs')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, bot) {
    if (interaction.user.bot) return;
    if (interaction.customId === 'verify') {
      try {
        const member = interaction.user;
        console.log('interactionCreate = ', member);
        // Send a DM to the user who invoked the command
        const embed = new EmbedBuilder()
          .setTitle("Verification")
          .setDescription("Please input your `@dlsu.edu.ph` email that you used to register to LSCS with. We will send you an email to verify your discord account and LSCS membership.")
          .setThumbnail("https://i.imgur.com/jVdfC7o.png")
          .setColor("#abd8ff")
          .setFooter({
            text: "39th La Salle Computer Society Research and Development",
            iconURL: "https://i.imgur.com/rrvsq8o.png",
          });

        if (await lscs.isVerifying(member) == undefined) await lscs.setVerifying(member);
        try {
          // Send a DM to the user who invoked the command
          await member.send({ embeds: [embed] });
          await interaction.reply({ content: 'Beep boop! Macky has sent you a message with instructions on how to verify!', ephemeral: true });
        } catch (error) {
          console.error('Error sending DM:', error);
          await interaction.reply({ content: 'errrrrrr `*/namatay` Oh no! Macky short-circuited and failed to send you a DM. Please check your privacy settings.', ephemeral: true });
        }

      } catch (error) {
        console.error(error)
      }
    }
  }
}
