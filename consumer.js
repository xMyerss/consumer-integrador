const amqplib = require('amqplib');
const io = require('socket.io-client');
const socket = io('http://34.230.94.49:4000');

(async () => {
    const queue = 'data';
    const conn = await amqplib.connect('amqp://44.216.167.198');
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
})();