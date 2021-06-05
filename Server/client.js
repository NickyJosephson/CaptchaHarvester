const loginharvester = require('../Captcha/login')
const harvestersinfo = require('../HarvestersInfo/harvesters.json')
const openharvester = require('../openharvester')

const io = require("socket.io-client");

const socket = io('ws://localhost:3000')
socket.on('connection', client => {console.log('Captcha Harvester Module Succesfully Connected to UI')});
socket.on("hello", async(arg) => {
	console.log(arg);
});
socket.on("open", async(harvestername) => {
	let proxy = harvestersinfo[harvestername].proxy
	console.log(proxy)
	await openharvester(harvestername,proxy)
	//socket.emit('opened')
});
// socket.on("harvesterlist", async() => {
// 	socket.emit(harvesterinfo)
// });
// socket.on("login", (harvestername,proxy) => {
// 	await loginharvester(harvestername,proxy)
// 	socket.emit('logged-in')
// });
// socket.on("close", (harvestername) => {
// 	await loginharvester(harvestername,proxy)
// 	socket.emit('logged-in')
// });