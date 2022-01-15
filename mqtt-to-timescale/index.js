import { connect } from 'mqtt'
import pg from 'pg'

const sql = new pg.Client({
    user: 'bot',
    password: 'ewxdyoyoLuv4trfRyJMfFyNFVLgduvLm',
    database: 'bolinas',
})

sql.connect(err => {
  if (err) throw err;

  const mqtt  = connect('mqtt://ok', { username: 'ok', password: '0c:c4:7a:b0:5d:68' })

  mqtt.on('connect', () => {
    mqtt.subscribe('bo/mon/+/+', (err, conns) => {
      console.log('subscribed to', conns[0]);
    })
  })

  mqtt.on('message', (topic, message) => {
    const [ _1, _2, place, metric ] = topic.split('/')
    if (metric === 'temp') {
      const [ time, degc ] = message.toString().split(' ')
      sql.query('INSERT INTO temperatures (time, place, degc) VALUES ($1, $2, $3)', [time, place, degc])
    }
  })
})

