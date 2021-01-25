// const Turn = require('node-turn');
// const server = new Turn({
//   // set options
//   // authMech: 'long-term',
//   authMech: 'none',
//   // listeningPort: 3478,
//   debugLevel: 'ALL',
//   credentials: {
//     username: "password"
//   }
// });
// server.start();

const stun = require('stun');

// stun.request('stun.l.google.com:3478', (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     const { address } = res.getXorAddress();
//     console.log(res)
//     console.log('your ip', address);
//   }
// });

// or with promise
async function a(){
  const res = await stun.request('127.0.0.1:3478');
  console.log('your ip', res.getXorAddress().address);
}
a()

