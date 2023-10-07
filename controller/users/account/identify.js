module.exports = {
  identify: async (userId, model) => {
    return await model
      .findOne({ _id: userId })
      .catch((err) => res.status(422).json(err));
  },
};
