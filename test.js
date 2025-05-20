// test-client.js
const io = require("socket.io-client");
const socket = io("http://192.168.0.33:3000");

socket.on("connect", () => {
  console.log("Connected!");
  const arrLength = 100;
const times = Array.from({length: arrLength}, (_, i) => i * (1/125)); // 125 Hz
const z = Array.from({length: arrLength}, () => Math.random());
socket.emit('sensorData', { times, z, sample_rate: 125 });

});

socket.on("calculationResult", (data) => {
  console.log("Received calculation result:", data);
  socket.disconnect();
});

socket.on("error", (err) => {
  console.log("Error:", err);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
