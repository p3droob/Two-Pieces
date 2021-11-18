module.exports = async (client, rate) => {
  let regex = /\/\w+\/\d+\/messages\/\d+\/reactions/i;
  if (regex.exec(rate.path)) return;
  console.log(rate)
}