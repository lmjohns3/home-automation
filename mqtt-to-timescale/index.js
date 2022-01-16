import arg from 'arg'
import { connect } from 'mqtt'
import pg from 'pg'

const args = arg({ '--pg': String, '--mqtt': String, '--sub': String })

const sql = new pg.Client(args['--pg'])

sql.connect(err => {
  if (err) throw err;

  const mqtt  = connect(args['--mqtt'] || 'mqtt://localhost')

  mqtt.on('connect', () => {
    mqtt.subscribe(args['--sub'] || '#', (err, conns) => {
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

