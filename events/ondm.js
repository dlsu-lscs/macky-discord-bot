const lscs = require('../utils/lscs')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'messageCreate',
  async execute(message, bot) {
    if (message.guild != null) return;
    if (message.author.bot) return;
    console.log(`messageCreate author: ${message.author}`);
    if (await lscs.isVerifying(message.author) == undefined) return;
    console.log(`messageCreate passed: ${message.author}`);
    if (message.content.includes(" ")) {
      const embed = new EmbedBuilder()
        .setTitle("Verification Error")
        .setDescription("Invalid email! Please include the email only without extra messages.")
        .setThumbnail("https://i.imgur.com/jVdfC7o.png")
        .setColor("#e79393")
        .setFooter({
          text: "39th La Salle Computer Society Research and Development",
          iconURL: "https://i.imgur.com/rrvsq8o.png",
        });

      await message.channel.send({ embeds: [embed] });
      return;
    }
    if (!message.content.endsWith("@dlsu.edu.ph")) {
      const embed = new EmbedBuilder()
        .setTitle("Verification Error")
        .setDescription("Invalid email! Please use your `@dlsu.edu.ph` email that you used to register to LSCS with.")
        .setThumbnail("https://i.imgur.com/jVdfC7o.png")
        .setColor("#e79393")
        .setFooter({
          text: "39th La Salle Computer Society Research and Development",
          iconURL: "https://i.imgur.com/rrvsq8o.png",
        });
      await message.channel.send({ embeds: [embed] });
      return;
    }

    const isMember = await lscs.isMember(message.content);
    console.log('isMember', isMember)
    if (!isMember) {
      const embed = new EmbedBuilder()
        .setTitle("Verification Error")
        .setDescription("The email you have entered is not registered as a member of La Salle Computer Society.\n\nIf you think this is a mistake, send an email to `lscs@dlsu.edu.ph`.")
        .setThumbnail("https://i.imgur.com/jVdfC7o.png")
        .setColor("#e79393")
        .setFooter({
          text: "39th La Salle Computer Society Research and Development",
          iconURL: "https://i.imgur.com/rrvsq8o.png",
        });
      await message.channel.send({ embeds: [embed] });
      return;
    }
    lscs.sendVerificationEmail(message.author, message.content);
    message.author.send('Verification sent! Please check your email.');
  }
}
