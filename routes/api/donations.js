const UserController = require('../../controller/users'),
  Controller = require('../../controller/donations'),
  { User, Donation, Pol } = require('../../models'),
  tokenizer = require('../../auth/tokenizer'),
  { STRIPE } = require('../../constants'),
  router = require('express').Router();

// All routes prefixed with '/api/donations'
router.route('/').post(tokenizer.guard(), async (req, res) => {
  req.body.fee =
    req.body.donation * STRIPE.FEES.PERCENTAGE + STRIPE.FEES.ADDEND;
  let newDonation = await Controller.create(req, res, Donation);
  if (newDonation) {
    const {
      settings: {
        autoTweet,
        showToolTips,
        showLoginLogout,
        ...autoEmailsOn
      },
    } = await UserController.contact(req.body.donatedBy, User);
    // controls auto-email via user settings
    if (autoEmailsOn.emailReceipts)
      Controller.receipt(newDonation, User, Pol);
  }
  res.json(newDonation);
});
router
  .route('/user/:userId')
  .get(tokenizer.guard(), (req, res) =>
    Controller.byUserId(req, res, Donation)
  );
router
  .route('/escrow')
  .get(tokenizer.guard(), (req, res) =>
    Controller.escrowed(req, res, Donation)
  );
router
  .route('/:donationId')
  .patch(tokenizer.guard(), (req, res) =>
    Controller.resolve(req, res, Donation)
  );
router
  .route('/receipt')
  .post(tokenizer.guard(), (req, res) =>
    res.json(Controller.receipt(req.body, User, Pol))
  );

module.exports = router;
