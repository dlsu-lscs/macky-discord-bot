const Verifying = require('../models/verifying')
const Config = require('../models/config')
const mysql = require('../database').mysql
const mailer = require('./mailer');

const setVerifying = async (member) => {
  try {
    const verifying_user = await
      Verifying({
        user_id: member.id,
        status: 'awaiting_email',
      }).save()
    console.log(`setVerifying: ${verifying_user}`);
    return verifying_user
  }
  catch (error) {
    throw error;
  }
}

const isVerifying = async (member) => {
  try {
    const verifying_user = await
      Verifying.findOne({ user_id: member.id, status: { $in: ['awaiting_email', 'verifying_email'] } }).exec()

    console.log(`isVerifying: ${verifying_user}`)
    if (verifying_user == null) return undefined
    if (verifying_user.status == 'done') return undefined
    return verifying_user
  }
  catch (error) {
    throw error;
  }
}

const isMember = async (email) => {
  try {
    const [result] = await
      mysql.query(`SELECT email FROM members WHERE email = '${email}' LIMIT 1`)
    console.log(`isMember (${result.length}) ${result}`)
    console.log(result)
    if (result.length == 0) return 0;
    else return result[0]
  }
  catch (err) {
    throw err;
  }
}

const sendVerificationEmail = async (member, email) => {
  try {
    const verifying_user = await Verifying.findOneAndUpdate({ user_id: member.id, },
      {
        status: 'verifying_email',
        email: email,
      }
    ).exec()
    console.log('verifation mongo')
    console.log(verifying_user)
    
    mailer.sendEmail(email, `${process.env.APP_URL}/verify/${verifying_user._id}`)

  } catch (err) { throw err; }
}


const setVerifyMessage = async (messageid) => {
  const config = await Config.findOneAndUpdate({ config: 'default' }, { verify_message_id: messageid }).exec();
  return config;
}

const getVerifyMessage = async () => {
  console.log(`getVerifyMessage: ${(await Config.findOne({ config: 'default' }).exec()).verify_message_id}`);
  return (await Config.findOne({ config: 'default' }).exec()).verify_message_id;
}

module.exports = { setVerifying, isVerifying, isMember, sendVerificationEmail, setVerifyMessage, getVerifyMessage };
