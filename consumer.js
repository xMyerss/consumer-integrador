const amqplib = require('amqplib');
const io = require('socket.io-client');
const socket = io('http://204.236.234.67:4000');

const rabbitSettings = {
    protocol: 'amqp',
    hostname: '52.21.218.239',
    port: 5672,
    username: 'blubbysoft',
    password: 'alpeca'
}

async function connect() {
    const queue = 'mqtt_queue';
    const conn = await amqplib.connect(rabbitSettings);
    console.log("Conexion exitosa");
    const ch1 = await conn.createChannel();
    await ch1.assertQueue(queue);

    // Listener
    ch1.consume(queue, (msg) => {
    if (msg !== null) {
        console.log('Recieved:', msg.content.toString());
        let recieved = msg.content.toString();
        let dataJSON = JSON.parse(recieved);
        socket.emit('message', dataJSON);

        ch1.ack(msg);
    } else {
        console.log('Consumer cancelled by server');
    }
  });
}

connect();