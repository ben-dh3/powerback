module.exports = {
  SigningUp: (sash, firstName, URI_ROOT) => {
    const URI = URI_ROOT + '/signup/' + sash;
    const CONFIRMATION_LINK = `<a href="${URI}" target="__blank" rel="noreferrer noopener"
    style="
      width:auto;
      max-width:25%;
      padding:10px;
      color: #000000;
      background: #c9f;
      text-decoration:none;
      border:1px solid #1b1b1b;
      border-radius:8px;
      cursor:pointer;
    ">
    Confirm Your New Account
    </a>`;
    return [
      0,
      'Confirm your new account',
      `Dear ${firstName ? firstName : 'Incoming Powerbacker'}:<br/><br/>
        Politicians want to make you pay for taking control of how they receive your donations. Don't let them.<br/><br/>
        Click the button below within five minutes from now to confirm your new account.<br/><br/>
        If you run out of time, it will expire. If so, just return to POWERBACK.me and sign up again. We will send you another email just like this one with a fresh link.<br/><br/>
       ${CONFIRMATION_LINK}
        <br/><br/>
        ---<br/>
        The <a href="https://powerback.me">POWERBACK</a> Team<br/>`,
    ];
  },
};
