const csv = require('csvtojson')

a = async function (x) {
  const a = await csv({noheader:true}).fromFile(x);
  return a
}

console.log(a("./task_data_table/abc.csv"))

