const donationAsk = `Since we're here talking, we truly appreciate you being a member of POWERBACK. As you likely already know, we depend 100% on donations from our users to run this service. Please keep this in mind the next time you make a contribution to a political candidate by giving us a tip.<br/><br/>
We also invite you to support us through our Patreon: 
<a href=\"https://www.patreon.com/powerback\">https://www.patreon.com/powerback</a><br/><br/>
If you are so inclined, we can accept Bitcoin donations through the following address: 1Q1HmBh9Wiqg5Kv12aY2zqhAnfz1CDz7Wr .<br/><br/>
The nation thanks you!<br/><br/>`;

module.exports = {
  Reset: (firstName) => {
    return [
      0,
      'Your password has been reset',
      `Dear ${firstName ? firstName : 'Powerbacker'},<br/><br/>
  This is an automated response to your updated password.<br/><br/>
  If you didn't request this, then someone else may have access to your email address and was able to follow the unique link created to reset your password. If you suspect this is the case, please email us at <a href="mailto:support@powerback.me">support@powerback.me</a> immediately.<br/><br/>
 ${donationAsk}
  ---<br/>
  The POWERBACK Team<br/>
  <a href=\"https://powerback.me\">POWERBACK.me</a>`,
    ];
  },
};
