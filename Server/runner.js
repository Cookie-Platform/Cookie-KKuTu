/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const Spawn = require("child_process").spawn;
const JLog = require("./lib/sub/jjlog");
const PKG = require("./package.json");
const LANG = require("../language.json");
const SETTINGS = require("../settings.json");
const SCRIPTS = {
	'GameServerOn': startGameServer,
	'GameServerOff': StopGameServer,
	'WebServerOn': startWebServer,
	'WebServerOff': StopWebServer,
	'StartServer': StartServer,
	'StopServer': StopServer,
	'program-info': () => {
		exports.send('alert', [
			`=== ${PKG.name} ===`,
			`${PKG.description}`, "",
			`Version: ${PKG.version}`,
			`Author: ${PKG.author}`,
			`License: ${PKG.license}`,
			`Repository: ${PKG.repository}`
		].join('\n'));
	},
	'program-blog': () => exports.send('external', "https://discord.gg/N4yDbSYByDzx"),
	'program-repo': () => exports.send('external', "https://github.com/Studio-RSP/PieKKuTu.git"),
	'exit': () => process.exit(0)
};
exports.MAIN_MENU = [
	{
		label: LANG['menu-server'],
		submenu: [
			{
				label: LANG['menu-Gameserver-on'],
				accelerator: "CmdOrCtrl+G+O",
				click: () => exports.run("GameServerOn")
			},
			{
				label: LANG['menu-Gameserver-off'],
				accelerator: "CmdOrCtrl+G+P",
				click: () => exports.run("GameServerOff")
			},
			{
				label: LANG['menu-Webserver-on'],
				acceleratore: "CmdOrCtrl+W+O",
				click: () => exports.run("WebServerOn")
			},
			{
				label: LANG['menu-Webserver-off'],
				accelerator: "CmdOrCtrl+W+P",
				click: () => exports.run("WebServerOff")
			},
			{
				label: LANG['menu-server-on'],
				accelerator: "CmdOrCtrl+O",
				click: () => exports.run("StartServer")
			},
			{
				label: LANG['menu-server-off'],
				accelerator: "CmdOrCtrl+P",
				click: () => exports.run("StopServer")
			}
		]
	},
	{
		label: LANG['menu-program'],
		submenu: [
			{
				label: LANG['menu-program-info'],
				click: () => exports.run("program-info")
			},
			{
				label: LANG['menu-program-blog'],
				click: () => exports.run("program-blog")
			},
			{
				label: LANG['menu-program-repo'],
				click: () => exports.run("program-repo")
			},
			{
				label: LANG['menu-program-dev'],
				role: "toggledevtools"
			},
			{ type: "separator" },
			{
				label: LANG['menu-program-exit'],
				accelerator: "Alt+F4",
				click: () => exports.run("exit")
			}
		]
	}
];
exports.run = (cmd) => {
	SCRIPTS[cmd]();
};
exports.send = (...argv) => {
	// override this
};

class ChildProcess{
	constructor(id, cmd, ...argv){
		this.process = Spawn(cmd, argv);
		this.process.stdout.on('data', msg => {
			exports.send('log', 'n', msg);
		});
		this.process.stderr.on('data', msg => {
			console.error(`${id}: ${msg}`);
			exports.send('log', 'e', msg);
		});
		this.process.on('close', code => {
			let msg;

			this.process.removeAllListeners();
			JLog.error(msg = `${id}: CLOSED WITH CODE ${code}`);
			this.process = null;

			exports.send('log', 'e', msg);
			exports.send('server-status', getGameServerStatus());
			exports.send('server-status', getWebServerStatus());
		});
	}
	kill(sig){
		if(this.process) this.process.kill(sig || 'SIGINT');
	}
}
let webServer, gameServers;

function startGameServer(){
	StopGameServer();
	if(SETTINGS['server-name']) process.env['KKT_SV_NAME'] = SETTINGS['server-name'];

	gameServers = [];

	for(let i=0; i<SETTINGS['game-num-inst']; i++){
		gameServers.push(new ChildProcess('G', "node", `${__dirname}/lib/Game/cluster.js`, i, SETTINGS['game-num-cpu']));
	}
	exports.send('server-status', getGameServerStatus());
}
function startWebServer(){
	StopWebServer();
	if(SETTINGS['server-name']) process.env['KKT_SV_NAME'] = SETTINGS['server-name'];
	
	webServer = new ChildProcess('W', "node", `${__dirname}/lib/Web/cluster.js`, SETTINGS['web-num-cpu']);
	exports.send('server-status', getWebServerStatus());
}
function StartServer(){
	StopServer();
	if(SETTINGS['server-name']) process.env['KKT_SV_NAME'] = SETTINGS['server-name'];

	gameServers = [];
	webServer = new ChildProcess('W', "node", `${__dirname}/lib/Web/cluster.js`, SETTINGS['web-num-cpu']);
	for(let i=0; i<SETTINGS['game-num-inst']; i++){
		gameServers.push(new ChildProcess('G', "node", `${__dirname}/lib/Game/cluster.js`, i, SETTINGS['game-num-cpu']));
	}
	exports.send('server-status', getServerStatus());
}
function StopWebServer(){
	if(webServer) webServer.kill();
}
function StopGameServer(){
	if(gameServers) gameServers.forEach(v => v.kill());
}
function StopServer(){
	if(webServer) webServer.kill();
	if(gameServers) gameServers.forEach(v => v.kill());
}
function getWebServerStatus(){
	if(!webServer) return 0;
	if(webServer.process) return 2;
	return 1;
}
function getGameServerStatus(){
	if(!gameServers) return 0;
	if(gameServers.every(v => v.process)) return 2;
	return 1;
}
function getServerStatus(){
	return getWebServerStatus() + getGameServerStatus();
}