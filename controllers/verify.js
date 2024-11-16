const express = require('express');
const Verifying = require('../models/verifying')
const User = require('../models/user')
const mysql = require('../database.js').mysql
const { EmbedBuilder } = require('discord.js')
const isVowel = require('is-vowel')
const router = express.Router();


const add_roles_to_guild = async (guild, hashmap, memberDataId) => {
  // - if inside dict, set it to that.
  let role = "Member"
  if (hashmap.hasOwnProperty(memberDataId)){
    role = guild.roles.cache.find(r => r.name === hashmap[memberDataId])
  } 

  await member.roles.add(role);
}

const verify = async (req, res) => {
  console.log('verifying ' + req.params.id)
  try {
    const ver_id = req.params.id;

    const ver = await Verifying.findOneAndUpdate(
      { _id: ver_id, status: { $ne: 'done' } }, 
      { status: 'done' }
    ).exec();

    if (ver == undefined) 
      return res.send('You are already verified. Open up discord!');

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
    
    const add_roles = (dict, memberId) => add_roles_to_guild(guild, dict, memberId)

    // - setup officer role
    let officer_id_to_name = {
       "EVP"   : "Core"
      ,"PRES"  : "Core"
      ,"VP"    : "Executive Board"
      ,"CT"    : "Officer"
      ,"AVP"   : "Officer"
      ,"JO"    : "Junior Officer"
    }
    add_roles(officer_id_to_name, memberData.position_id)    

    // - setup officer committee
    let committee_id_to_name = {
       "RND"         : "Research and Development"
      ,"HRD"         : "Human Resource Development"
      ,"TND"         : "Training and Development"
      ,"ACADS"       : "Academics"
      ,"CORPREL"     : "Corporate Relations"
      ,"PUBS"        : "Publicity and Creatives"
      ,"SOCIOCIVIC"  : "Socio-Civic"
      ,"UNIVREL"     : "University Relations"
      ,"DOCULOGI"    : "Documentation and Logistics"
      ,"FIN"         : "Finance"
    }
    add_roles(committee_id_to_name, memberData.committee_id)

    // - setup officer division
    let division_id_to_name = {
       "OPS" : "Operations"
      ,"INT" : "Internals"
      ,"EXT" : "Externals"
    }
    add_roles(division_id_to_name, memberData.division_id)

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
  } catch (err) {
    console.error(err)
    return res.send('An error occured while trying to verify you. Please contact sean_robenta@dlsu.edu.ph.');
  }
}

module.exports = verify
