const router = require('express').Router(),
  { Pol, Bill } = require('../../models'),
  tokenizer = require('../../auth/tokenizer'),
  Controller = require('../../controller/congress');

// All routes prefixed with '/api/congress'
router
  .route('/bills/:id')
  .get(tokenizer.guard(), (req, res) =>
    Controller.getBill(req, res, Bill)
  );
router
  .route('/pols')
  .get(tokenizer.guard(), (req, res) =>
    Controller.getChambers(req, res, Pol)
  );
router.route('/pols').put(tokenizer.guard(), (req, res) => {
  Controller.fetchUpdatedPols(req, res, Pol);
});
router
  .route('/cosponsors/:bill')
  .get(tokenizer.guard(), (req, res) =>
    Controller.getCosponsors(req, res)
  );
router
  .route('/pols/:id')
  .get(tokenizer.guard(), (req, res) => Controller.getPol(req, res, Pol));
router
  .route('/pi')
  .get(tokenizer.guard(), (req, res) => Controller.partisanize(req, res));

module.exports = router;
