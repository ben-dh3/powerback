module.exports = {
  SignedUp: (firstName) => {
    return [
      3,
      'Thank you for joining POWERBACK!',
      `Dear ${firstName ? firstName : 'Newest Powerbacker'},<br/><br/>
        Some call American democracy the "Great Experiment." I like to think of POWERBACK as the Great Experiment's great experiment, and I'm so glad to have you join our movement.<br/><br/>
        Please forward this email to a friend or, better yet, a neighbor. Together we can ensure that those who are given the honor of representing the American people will never take one of your hard-earned dollars for granted ever again.<br/><br/>
        Your Friend and Countryman,<br/>
        Jonathan from <a href="https://powerback.me">POWERBACK.me</a>`,
    ];
  },
};
