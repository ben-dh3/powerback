module.exports = {
  next: (bound) => {
    let getNextCampaignBoundedYearDateInMilliseconds = (boundedYear) => {
      return boundedYear.setFullYear(
        new Date(boundedYear).getFullYear() + 2
      );
    };
    const prettyDate = (milliseconds) => {
      return new Date(milliseconds).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };
    return prettyDate(getNextCampaignBoundedYearDateInMilliseconds(bound));
  },
};
