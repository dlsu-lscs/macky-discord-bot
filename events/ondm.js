const lscs = require('../utils/lscs')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'messageCreate',
  async execute(message, bot) {
    
    const createEmbedError = (text_description) => {
      return new EmbedBuilder()
        .setTitle("Verification Error")
        .setDescription(text_description)
        .setThumbnail("https://i.imgur.com/jVdfC7o.png")
        .setColor("#e79393")
        .setFooter({
          text: "39th La Salle Computer Society Research and Development",
          iconURL: "https://i.imgur.com/rrvsq8o.png",
        })
    }

    if (message.guild != null) return;

    if (message.author.bot) return;
    
    console.log(`messageCreate author: ${message.author}`);
    
    if (await lscs.isVerifying(message.author) == undefined) return;

    console.log(`messageCreate passed: ${message.author}`);

    if (message.content.includes(" ")) {
      const embed = createEmbedError("Invalid email! Please include the email only without extra messages.")
      await message.channel.send({ embeds: [embed] });
      return;
    }

    if (!message.content.endsWith("@dlsu.edu.ph")) {
      const embed = createEmbedError("Invalid email! Please use your `@dlsu.edu.ph` email that you used to register to LSCS with.")
      await message.channel.send({ embeds: [embed] });
      return;
    }

    const isMember = await lscs.isMember(message.content);
    console.log('isMember', isMember)

    if (!isMember) {
      const embed = createEmbedError("The email you have entered is not registered as a member of La Salle Computer Society.\n\nIf you think this is a mistake, send an email to `lscs@dlsu.edu.ph`.");
      await message.channel.send({ embeds: [embed] });
      return;
    }
    
    lscs.sendVerificationEmail(message.author, message.content);
    message.author.send('Verification sent! Please check your email.');
  }
}
