import { io } from "socket.io-client/dist/socket.io";

export default function(Vue){
	Vue.prototype.serverUrl = 'http://localhost:3000'		// 后端API baseUrl
	Vue.prototype.socket = io('ws://localhost:3001',{
		cors: true
	})
}