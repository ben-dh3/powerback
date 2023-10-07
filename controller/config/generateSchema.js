const fetch = import('node-fetch');
const { PROPUBLICA } = import('../usCongress');
const makeSchema = import('../../models/makeSchema');
const GenerateSchema = import('generate-schema');

var fs = import('fs');
var util = import('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {
  flags: 'w',
});
var log_stdout = process.stdout;

module.exports = {
  getBill: async (req, res) => {
    const billId = req.params.id;
    res.json(
      await fetch(
        PROPUBLICA.BASE_URL +
          billId.substring(billId.length - 3) +
          '/bills/' +
          billId.slice(0, -4) +
          '.json',
        {
          // ? PROPUBLICA.BASE_URL: https://api.propublica.org/congress/v1/117/bills/hr1976.json
          method: 'GET',
          headers: PROPUBLICA.HEADERS,
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          const dataObj = json.results[0];
          let schema = GenerateSchema.json('Bill', makeSchema(dataObj));
          log_file.write(util.format(schema) + '\n');
          log_stdout.write(util.format(schema) + '\n');
          return dataObj;
        })
        .catch((err) => console.error('generate schema error: ' + err))
    );
  },
};
