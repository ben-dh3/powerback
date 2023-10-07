module.exports = {
  transfer: (applicant, userModel) => {
    userModel
      .create({
        ...applicant,
        username: applicant.username,
        password: applicant.password,
      })
      .catch((err) => {
        return err;
      });
  },
};
