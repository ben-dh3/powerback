const { getPol, getBill, getChambers, getCosponsors } = require('./get'),
  { fetchUpdatedPols } = require('./put'),
  {} = require('./delete'),
  {} = require('./post');

module.exports = {
  fetchUpdatedPols,
  getCosponsors,
  getChambers,
  getBill,
  getPol,
};
