const express = require('express');
const Verifying = require('../models/verifying')
const User = require('../models/user')
const mysql = require('../database.js').mysql
const { EmbedBuilder } = require('discord.js')
const isVowel = require('is-vowel')
const router = express.Router();

const verify = async (req, res) => {
  console.log('verifying ' + req.params.id)
  try {
    const ver_id = req.params.id;

    const ver = await Verifying.findOneAndUpdate({ _id: ver_id, status: { $ne: 'done' } },
      {
        status: 'done'
      }
    ).exec();

    if (ver == undefined) return res.send('You are already verified. Open up discord!');

    await User({
      discord_id: ver.user_id,
      email: ver.email
    }).save()

    const [result] = await mysql.query
      (`
      SELECT m.email, m.nickname, m.position_id, p.position_name, c.committee_id, c.committee_name, d.division_id
      FROM members m 
      JOIN positions  p ON m.position_id  = p.position_id
      JOIN committees c ON m.committee_id = c.committee_id
      JOIN divisions  d ON c.division_id  = d.division_id
      WHERE m.email = '${ver.email}'
    `)
    const memberData = result[0]
    console.log(memberData)

    console.log('req.body')
    // console.log(req.discord_client.guilds.cache);
    const guild = await req.discord_client.guilds.cache.get(process.env.GUILD_ID);
    const member = await guild.members.fetch(ver.user_id);

    // - setup officer role
    let role = guild.roles.cache.find(r => r.name === "Member");
    if (memberData.position_id === "EVP" || memberData.position_id === "PRES") {
      role = guild.roles.cache.find(r => r.name === "Core");
    } else if (memberData.position_id === "CT" || memberData.position_id === "AVP") {
      role = guild.roles.cache.find(r => r.name === "Officer");
    } else if (memberData.position_id === "VP") {
      role = guild.roles.cache.find(r => r.name === "Executive Board");
    } else if (memberData.position_id === "JO") {
      role = guild.roles.cache.find(r => r.name === "Junior Officer");
    }
    await member.roles.add(role);

    // - setup officer committee
    // role = guild.roles.cache.find(r => r.name === "Member");
    if (memberData.committee_id === "RND") {
      role = guild.roles.cache.find(r => r.name === "Research and Development");
    } else if (memberData.committee_id === "HRD") {
      role = guild.roles.cache.find(r => r.name === "Human Resource Development");
    } else if (memberData.committee_id === "TND") {
      role = guild.roles.cache.find(r => r.name === "Training and Development");
    } else if (memberData.committee_id === "ACADS") {
      role = guild.roles.cache.find(r => r.name === "Academics");
    } else if (memberData.committee_id === "CORPREL") {
      role = guild.roles.cache.find(r => r.name === "Corporate Relations");
    } else if (memberData.committee_id === "PUBS") {
      role = guild.roles.cache.find(r => r.name === "Publicity and Creatives");
    } else if (memberData.committee_id === "SOCIOCIVIC") {
      role = guild.roles.cache.find(r => r.name === "Socio-Civic");
    } else if (memberData.committee_id === "UNIVREL") {
      role = guild.roles.cache.find(r => r.name === "University Relations");
    } else if (memberData.committee_id === "DOCULOGI") {
      role = guild.roles.cache.find(r => r.name === "Documentation and Logistics");
    } else if (memberData.committee_id === "FIN") {
      role = guild.roles.cache.find(r => r.name === "Finance");
    }
    await member.roles.add(role);

    // - setup officer division
    if (memberData.divison_id === "OPS") {
      role = guild.roles.cache.find(r => r.name === "Operations")
    } else if (memberData.divison_id === "INT") {
      role = guild.roles.cache.find(r => r.name === "Internals")
    } if (memberData.divison_id === "EXT") {
      role = guild.roles.cache.find(r => r.name === "Externals")
    }
    await member.roles.add(role);

    const embed = new EmbedBuilder()
      .setTitle(`Welcome to LSCScord, ${memberData.nickname}!`)
      .setDescription(`Cheers to a fruitful year as ${isVowel(memberData.position_name[0]) ? "an" : "a"} ${memberData.position_name} in ${memberData.committee_name}!`)
      .setThumbnail("https://i.imgur.com/jVdfC7o.png")
      .setColor("#abd8ff")
      .setFooter({
        text: "39th La Salle Computer Society Research and Development",
        iconURL: "https://i.imgur.com/rrvsq8o.png",
      });
    await member.send({ embeds: [embed] });
    return res.redirect('https://discord.com')
  }
  catch (err) {
    console.error(err)
    return res.send('An error occured while trying to verify you. Please contact sean_robenta@dlsu.edu.ph.');
  }
}

module.exports = verify
