const { trawl } = require('../../services');

module.exports = {
  getChambers: async (req, res) => {
    let house, senate;
    try {
      house = await trawl('pols', 'house');
    } catch (err) {
      console.error('getChambers error: ' + err);
      res.sendStatus(500).json();
    }
    try {
      senate = await trawl('pols', 'senate');
    } catch (err) {
      console.error('getChambers error: ' + err);
      res.sendStatus(500).json();
    }
    const allPols = await house.members.concat(senate.members);
    res.json(allPols.filter((pol) => pol.in_office));
  },
};
