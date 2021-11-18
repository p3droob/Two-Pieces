module.exports = (Guild, User, Message) => {
  require('./Guild')(Guild);
  require('./User')(User);
  require('./Message')(Message)
}