import arg from 'arg'
import mqtt from 'mqtt'
import pg from 'pg'
import url from 'url'

const args = arg({ '--pg': String, '--mqtt': String, '--sub': String })

const sql = new pg.Client(args['--pg'])

sql.connect(err => {
  if (err) throw err;

  const m = url.parse(args['--mqtt'] || 'mqtt://localhost')

  const protocol = m.protocol || 'mqtt:'
  const host = m.host || 'localhost'
  const port = m.port || 1883

  const opts = {}
  if (m.auth) [ opts.username, opts.password ] = m.auth.split(':')

  const broker = mqtt.connect(`${protocol}//${host}:${port}`, opts)

  broker.on('connect', () => {
    broker.subscribe(args['--sub'] || '#', (err, conns) => {
      console.log('subscribed to', conns[0])
    })
  })

  broker.on('message', (topic, message) => {
    const [ _1, _2, place, metric ] = topic.split('/')
    if (metric === 'temp') {
      const [ time, degc ] = message.toString().split(' ')
      sql.query('INSERT INTO temperatures (time, place, degc) VALUES ($1, $2, $3)', [time, place, degc])
    }
  })
})

