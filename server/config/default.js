const config = {
  port:3000,
  database:{
    HOST:'localhost',
    PORT:3306,
    USER:'root',
    PASSWORD:'root',
    PARTYTABLE:'partyTable'
  },
  jwt:{
    jwtSecretKey: 'I am jwtSecretKey',
    algorithms:["HS256"]
  }
}

module.exports = config