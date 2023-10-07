const { nextStart } = require('../../../congress'),
  nextCampaignStart = nextStart();
const { FEC } = require('../../../../constants');
const accounting = require('accounting');
require('dotenv').config();

const FEC_URI = process.env.REACT_APP_FEC_INDIVIDUAL_CONTRIBUTIONS,
  PB_URI = process.env.REACT_APP_PROD_URI;

module.exports = {
  Promoted: (firstName) => {
    const FEC_LINK = `<a href=${FEC_URI} target="__blank" rel="noreferrer noopener">Individual contributions page</a>`;
    const PB_LINK = `<a href=${PB_URI}>POWERBACK.me</a>`;

    const d = accounting.formatMoney(FEC.LEGAL_LIMIT[0]),
      D = accounting.formatMoney(FEC.LEGAL_LIMIT[1]);

    return [
      2,
      'Re: Your newly compliant POWERBACK account',
      `Dear ${firstName ? firstName : 'Compliant Powerbacker'},<br/><br/>
Thank you for providing your personal information. You are now legally compliant with Federal Election Commission regulations, allowing you to give the maximum amount of ${D} per federal election, per campaign cycle. The law states that contributions over ${d} cannot be from anonymous persons, and that this information you have provided must be on the record along with the donation. These records are available for anyone to see at the ${FEC_LINK} of the FEC's website.<br/><br/>
To be clear, the maximum ${D} amount is per federal election - meaning you can give up to ${D} to one or many candidates of an election, and still be able to give up to ${D} to candidates in another federal election, and then once again if you wish to give another election's candidate(s), etc. These maximums reset at the start of the next campaign cycle on ${nextCampaignStart}. <br/><br/>

          Your Friend and Countryman,<br/>
          Jonathan from ${PB_LINK}`,
    ];
  },
};
