const { trawl } = require('../../services/');

module.exports = {
  getCosponsors: async (req, res) => {
    try {
      const results = await trawl('cosponsors', req.params.bill);
      const { cosponsors: innerCosponsors } = results;
      const sponsorId = results.sponsor_id;

      if (typeof innerCosponsors === 'undefined') {
        console.log('getCosponsors error: return array is undefined');
        res.sendStatus(500).json();
      } else {
        let ids = innerCosponsors.map((c) => c.cosponsor_id);
        ids.unshift(sponsorId);
        res.json(ids);
      }
    } catch (err) {
      console.error('getCosponsors error: ' + err);
      res.sendStatus(500).json();
    }
  },
};
