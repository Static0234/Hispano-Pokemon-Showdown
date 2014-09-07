/**
 * Commands
 * Pokemon Showdown - https://pokemonshowdown.com/
 *
 * These are commands. For instance, you can define the command 'whois'
 * here, then use it by typing /whois into Pokemon Showdown.
 *
 * A command can be in the form:
 *   ip: 'whois',
 * This is called an alias: it makes it so /ip does the same thing as
 * /whois.
 *
 * But to actually define a command, it's a function:
 *
 *   allowchallenges: function (target, room, user) {
 *     user.blockChallenges = false;
 *     this.sendReply("You are available for challenges from now on.");
 *   }
 *
 * Commands are actually passed five parameters:
 *   function (target, room, user, connection, cmd, message)
 * Most of the time, you only need the first three, though.
 *
 * target = the part of the message after the command
 * room = the room object the message was sent to
 *   The room name is room.id
 * user = the user object that sent the message
 *   The user's name is user.name
 * connection = the connection that the message was sent from
 * cmd = the name of the command
 * message = the entire message sent by the user
 *
 * If a user types in "/msg zarel, hello"
 *   target = "zarel, hello"
 *   cmd = "msg"
 *   message = "/msg zarel, hello"
 *
 * Commands return the message the user should say. If they don't
 * return anything or return something falsy, the user won't say
 * anything.
 *
 * Commands have access to the following functions:
 *
 * this.sendReply(message)
 *   Sends a message back to the room the user typed the command into.
 *
 * this.sendReplyBox(html)
 *   Same as sendReply, but shows it in a box, and you can put HTML in
 *   it.
 *
 * this.popupReply(message)
 *   Shows a popup in the window the user typed the command into.
 *
 * this.add(message)
 *   Adds a message to the room so that everyone can see it.
 *   This is like this.sendReply, except everyone in the room gets it,
 *   instead of just the user that typed the command.
 *
 * this.send(message)
 *   Sends a message to the room so that everyone can see it.
 *   This is like this.add, except it's not logged, and users who join
 *   the room later won't see it in the log, and if it's a battle, it
 *   won't show up in saved replays.
 *   You USUALLY want to use this.add instead.
 *
 * this.logEntry(message)
 *   Log a message to the room's log without sending it to anyone. This
 *   is like this.add, except no one will see it.
 *
 * this.addModCommand(message)
 *   Like this.add, but also logs the message to the moderator log
 *   which can be seen with /modlog.
 *
 * this.logModCommand(message)
 *   Like this.addModCommand, except users in the room won't see it.
 *
 * this.can(permission)
 * this.can(permission, targetUser)
 *   Checks if the user has the permission to do something, or if a
 *   targetUser is passed, check if the user has permission to do
 *   it to that user. Will automatically give the user an "Access
 *   denied" message if the user doesn't have permission: use
 *   user.can() if you don't want that message.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.can('potd')) return false;
 *
 * this.canBroadcast()
 *   Signifies that a message can be broadcast, as long as the user
 *   has permission to. This will check to see if the user used
 *   "!command" instead of "/command". If so, it will check to see
 *   if the user has permission to broadcast (by default, voice+ can),
 *   and return false if not. Otherwise, it will add the message to
 *   the room, and turn on the flag this.broadcasting, so that
 *   this.sendReply and this.sendReplyBox will broadcast to the room
 *   instead of just the user that used the command.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canBroadcast()) return false;
 *
 * this.canBroadcast(suppressMessage)
 *   Functionally the same as this.canBroadcast(). However, it
 *   will look as if the user had written the text suppressMessage.
 *
 * this.canTalk()
 *   Checks to see if the user can speak in the room. Returns false
 *   if the user can't speak (is muted, the room has modchat on, etc),
 *   or true otherwise.
 *
 *   Should usually be near the top of the command, like:
 *     if (!this.canTalk()) return false;
 *
 * this.canTalk(message, room)
 *   Checks to see if the user can say the message in the room.
 *   If a room is not specified, it will default to the current one.
 *   If it has a falsy value, the check won't be attached to any room.
 *   In addition to running the checks from this.canTalk(), it also
 *   checks to see if the message has any banned words, is too long,
 *   or was just sent by the user. Returns the filtered message, or a
 *   falsy value if the user can't speak.
 *
 *   Should usually be near the top of the command, like:
 *     target = this.canTalk(target);
 *     if (!target) return false;
 *
 * this.parse(message)
 *   Runs the message as if the user had typed it in.
 *
 *   Mostly useful for giving help messages, like for commands that
 *   require a target:
 *     if (!target) return this.parse('/help msg');
 *
 *   After 10 levels of recursion (calling this.parse from a command
 *   called by this.parse from a command called by this.parse etc)
 *   we will assume it's a bug in your command and error out.
 *
 * this.targetUserOrSelf(target, exactName)
 *   If target is blank, returns the user that sent the message.
 *   Otherwise, returns the user with the username in target, or
 *   a falsy value if no user with that username exists.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 * this.getLastIdOf(user)
 *   Returns the last userid of an specified user.
 *
 * this.splitTarget(target, exactName)
 *   Splits a target in the form "user, message" into its
 *   constituent parts. Returns message, and sets this.targetUser to
 *   the user, and this.targetUsername to the username.
 *   By default, this will track users across name changes. However,
 *   if exactName is true, it will enforce exact matches.
 *
 *   Remember to check if this.targetUser exists before going further.
 *
 * Unless otherwise specified, these functions will return undefined,
 * so you can return this.sendReply or something to send a reply and
 * stop the command there.
 *
 * @license MIT license
 */

var commands = exports.commands = {

	ip: 'whois',
	rooms: 'whois',
	alt: 'whois',
	alts: 'whois',
	whois: function (target, room, user) {
		var targetUser = this.targetUserOrSelf(target, user.group === Config.groups.default.global);
		if (!targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}

		this.sendReply("User: " + targetUser.name);
		if (user.can('alts', targetUser)) {
			var alts = targetUser.getAlts(true);
			var output = Object.keys(targetUser.prevNames).join(", ");
			if (output) this.sendReply("Previous names: " + output);

			for (var j = 0; j < alts.length; ++j) {
				var targetAlt = Users.get(alts[j]);
				if (!targetAlt.named && !targetAlt.connected) continue;
				if (Config.groups.bySymbol[targetAlt.group] && Config.groups.bySymbol[user.group] &&
					Config.groups.bySymbol[targetAlt.group].rank > Config.groups.bySymbol[user.group].rank) continue;

				this.sendReply("Alt: " + targetAlt.name);
				output = Object.keys(targetAlt.prevNames).join(", ");
				if (output) this.sendReply("Previous names: " + output);
			}
			if (targetUser.locked) {
				this.sendReply("Locked under the username: " + targetUser.locked);
			}
		}
		if (Config.groups.bySymbol[targetUser.group] && Config.groups.bySymbol[targetUser.group].name) {
			this.sendReply("Group: " + Config.groups.bySymbol[targetUser.group].name + " (" + targetUser.group + ")");
		}
		if (targetUser.isSysop) {
			this.sendReply("(Pok\xE9mon Showdown System Operator)");
		}
		if (!targetUser.authenticated) {
			this.sendReply("(Unregistered)");
		}
		if (!this.broadcasting && (user.can('ip', targetUser) || user === targetUser)) {
			var ips = Object.keys(targetUser.ips);
			this.sendReply("IP" + ((ips.length > 1) ? "s" : "") + ": " + ips.join(", "));
			this.sendReply("Host: " + targetUser.latestHost);
		}
		var output = "In rooms: ";
		var first = true;
		for (var i in targetUser.roomCount) {
			if (i === 'global' || Rooms.get(i).isPrivate) continue;
			if (!first) output += " | ";
			first = false;

			output += '<a href="/' + i + '" room="' + i + '">' + i + '</a>';
		}
		this.sendReply('|raw|' + output);
	},

	ipsearch: function (target, room, user) {
		if (!this.can('rangeban')) return;
		var atLeastOne = false;
		this.sendReply("Users with IP " + target + ":");
		for (var userid in Users.users) {
			var curUser = Users.users[userid];
			if (curUser.latestIp === target) {
				this.sendReply((curUser.connected ? " + " : "-") + " " + curUser.name);
				atLeastOne = true;
			}
		}
		if (!atLeastOne) this.sendReply("No results found.");
	},

	roomkick: function (target, room, user) {
		target = toId(target);
		targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.sendReply('Ese usuario no existe o no esta activo');
		if (user.can('ban', targetUser)) var allowed = true;
		if (room.auth && (room.auth[user.userid] === '%' || room.auth[user.userid] === '#')) var allowed = true;
		if (!allowed) return this.sendReply('No tienes suficiente poder para utilizar este comando');
		if (!room.users[target]) return this.sendReply('Ese usuario no esta en esta sala');
		targetUser.leaveRoom(room);
		room.addRaw(user.name + ' ha expulsado a ' + targetUser.name + ' del canal.');
	},

	kickall: function (target, room, user) {
		target = toId(target);
		targetUser = Users.get(target);
		if (!targetUser || !targetUser.connected) return this.sendReply('Ese usuario no existe o no esta activo');
		if (!user.can('ban', targetUser)) return this.sendReply('No tienes suficiente poder para utilizar este comando');
		targetUser.disconnectAll();
		room.addRaw(user.name + ' ha expulsado a ' + targetUser.name + ' del servidor.');
		if (Rooms.rooms.staff) Rooms.rooms.staff.addRaw(user.name + ' ha expulsado a ' + targetUser.name + ' del servidor.');
	},

	/*********************************************************
	 * Comandos de la liga
	 *********************************************************/

	lideres: 'liga',
	liga: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var path = 'http://pokemon-hispano.comxa.com/showthread.php?tid=';
		return this.sendReply('|raw|' +
			"<center>" +
				"<img src=\"http://i.imgur.com/SU0aFTt.png\" />" +
				"<div class=\"league\">" +
					"<h4>CAMPEÓN DE LA LIGA POKÉMON HISPANO</h4>" +
					"<p>N/A</p>" +
					"<hr />" +
					"<div class=\"alto-mando\">" +
						"<a href=" + path + 623 + "><button>ALTO MANDO</button></a>" +
						"<ul>" +
							"<li>(LoD)Tyrana: Dragon</li>" +
							"<li>Shiny Giratina-O: Agua</li>" +
							"<li>Based God: Sunny</li>" +
							"<li>Riuoker-: Psiquico</li>" +
							"<li>(LoD)Marcos: Acero</li>" +
						"</ul>" +
					"</div>" +
					"<hr />" +
					"<div class=\"lideres\">" +
						"<h4>LÍDERES DE GIMNASIOS</h4>" +
							"<table>" +
								"<tr>" +
									"<td><a href=" + path + 628 + ">FC CAMULOS: Normal</a></td>" +
									"<td><a href=" + path + 637 + ">FC JOMA: Hielo</a></td>" +
									"<td><a href=" + path + 629 + ">FC ADRIELANDRO: Agua</a></td>" +
								"</tr>" +
								"<tr>" +
									"<td><a href=" + path + 563 + ">(ABT) Ryuga: Lucha</a></td>" +
									"<td><a href=" + path + 648 + ">AlyssaSoraya: Bicho</a></td>" +
									"<td><a href=" + path + 000 + ">Disponible: Roca</a></td>" +
								"</tr>" +
								"<tr>" +
									"<td><a href=" + path + 000 + ">Disponible: Hada</a></td>" +
									"<td><a href=" + path + 570 + ">Miranda L.: Volador</a></td>" +
									"<td><a href=" + path + 633 + ">davidness: Fantasma</a></td>" +
								"</tr>" +
								"<tr>" +
									"<td><a href=" + path + 539 + ">Sidaaaaa: Tierra</a></td>" +
									"<td><a href=" + path + 647 + "knight of war: Siniestro</a></td>" +
									"<td><a href=" + path + 000 + ">Disponible: Veneno</a></td>" +
								"</tr>" +
								"<tr>" +
									"<td><a href=" + path + 000 + ">Disponible: Fuego</a></td>" +
									"<td><a href=" + path + 000 + ">Kruzes: Eléctrico</a></td>" +
									"<td><a href=" + path + 000 + ">Disponible: Dragón</a></td>" +
								"</tr>" +
							"</table>" +
					"</div>" +
					"<hr />" +
					"<ul>" +
						"<li><a href=\"http://pokemon-hispano.comxa.com/showthread.php?tid=529/\">Cómo desafiar la liga.</a></li>" +
						"<li><a href=\"http://www.pokemon-hispano.comxa.com/showthread.php?tid=626/\">Información detallada sobre la Liga Pokémon Hispano.</a></li>" +
					"</ul>" +
					"<h3>Battle Sages Approaching....</h3>" +
				"</div>" +
				"<img src=\"http://i.imgur.com/zqidpf4.png\" />" +
			"</center>"
		);
	},

	opengym: 'abrirliga',
	abrirgimnasio: 'abrirliga',
	abrirliga: function (target, room, user) {
		var auxlider = tour.lideres().indexOf(user.userid);
		var auxelite = tour.altomando().indexOf(user.userid);
		if (auxlider > -1) {
			user.gymopen = true;
			if (Rooms.rooms.lobby) Rooms.rooms.lobby.addRaw('<b><font color="#6E1333">' + user.name + ', ' + tour.cargos()[auxlider] + ', esta disponible para desafios.</b> Utiliza el comando /retarlider ' + user.name + ' si quieres luchar contra el.');
			if (Rooms.rooms.ligapokemonhispano) Rooms.rooms.ligapokemonhispano.addRaw('<b><font color="#6E1333">' + user.name + ', ' + tour.cargos()[auxlider] + ', esta disponible para desafios.</b> Utiliza el comando /retarlider ' + user.name + ' si quieres luchar contra el.');
			return this.sendReply('Ahora estas disponible para desafios. Utiliza el comando /retos para ver quienes quieren luchar contra ti y en que orden.');
		} else if (auxelite > -1) {
			user.gymopen = true;
			if (Rooms.rooms.lobby) Rooms.rooms.lobby.addRaw('<b><font color="#6E1333">' + user.name + ', Miembro del Alto Mando de la Liga Pokemon Hispano, esta disponible para  desafios.</b> Utiliza el comando /retarlider ' + user.name + ' si quieres luchar contra el.');
			if (Rooms.rooms.ligapokemonhispano) Rooms.rooms.ligapokemonhispano.addRaw('<b><font color="#6E1333">' + user.name + ', Miembro del Alto Mando de la Liga Pokemon Hispano, esta disponible para  desafios.</b> Utiliza el comando /retarlider ' + user.name + ' si quieres luchar contra el.');
		} else {
			return this.sendReply('<b><font color="red">Desde cuando eres lider? Verifica si tu ID esta registrado ante la Liga con el comando /lideresid. Tu ID actual es ' + user.userid);
		}
	},

	closegym: 'cerrarliga',
	cerrargimnasio: 'cerrarliga',
	cerrarliga: function (target, room, user) {
		var auxlider = tour.lideres().indexOf(user.userid);
		var auxelite = tour.altomando().indexOf(user.userid);
		if (auxlider > -1) {
			user.gymopen = false;
			if (Rooms.rooms.lobby) Rooms.rooms.lobby.addRaw('<b><font color="#6E1333">' + user.name + ', ' + tour.cargos()[auxlider] + ', ya no esta disponible para  desafios.</b>');
			if (Rooms.rooms.ligapokemonhispano) Rooms.rooms.ligapokemonhispano.addRaw('<b><font color="#6E1333">' + user.name + ', ' + tour.cargos()[auxlider] + ', ya no esta disponible para desafios.</b>');
		} else if (auxelite > -1) {
			user.gymopen = false;
			if (Rooms.rooms.lobby) Rooms.rooms.lobby.addRaw('<b><font color="#6E1333">' + user.name + ', Miembro del Alto Mando de la Liga Pokemon Hispano, ya no esta  disponible para  desafios.</b>');
			if (Rooms.rooms.ligapokemonhispano) Rooms.rooms.ligapokemonhispano.addRaw('<b><font color="#6E1333">' + user.name + ',  Miembro del Alto Mando de la Liga Pokemon Hispano, ya no esta disponible para   desafios.</b>');
		} else {
			return this.sendReply('<b><font color="red">Desde cuando eres lider? Verifica si tu ID esta registrado ante la Liga con el comando /lideresid. Tu ID actual es ' + user.userid);
		}
	},

	lideresid: function (target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReply('Los siguientes son los ID oficiales de lideres de gimnasio: ' + tour.lideres().toString() + '. Cualquier variante que no cambie letras ni numeros es un nombre oficial.')
	},

	retarliga: 'lideresdisponibles',
	retarlider: 'lideresdisponibles',
	retarlideres: 'lideresdisponibles',
	lideresdisponibles: function (target, room, user) {
		var disponibles = [];
		for (var i = 0; i < tour.lideres().length; i++) {
			var loopuser = Users.get(tour.lideres()[i]);
			if (loopuser && loopuser.gymopen) {
				disponibles.push(loopuser.name);
			}
		}
		if (!target) {
			if (!this.canBroadcast()) return;
			if (disponibles.length === 1) {
				return this.sendReply('Solo ' + disponibles[0] + ' esta aceptando desafios ahora.');
			} else if (disponibles.length) {
				return this.sendReply('Los siguientes lideres estan aceptando desafios ahora: ' + disponibles.toString());
			} else {
				return this.sendReply('Ningun lider esta aceptando desafios.');
			}
		} else {
			target = toId(target);
			for (var i = 0; i < disponibles.length; i++) {
				if (toId(disponibles[i]) === target) {
					var matched = true;
					break;
				}
			}
			if (!matched) {
				return this.sendReply('El lider que quieres retar no esta disponible o no existe. Para consultar los lideres existentes, escribe /lideres. Para ver los lideres disponibles, escribe /retarlider');
			} else {
				var retado = Users.get(target);
				if (!retado) return this.sendReply('Ocurrio un error al intentar enviar el desafio.');
				if (!retado.challengers) retado.challengers = [];
				var index = retado.challengers.indexOf(user.userid);
				if (index === -1) {
					if (retado.noinscription) return this.sendReply('El lider que quieres desafiar tiene una larga lista de retadores y ha decidido cerrar la inscripcion a su gimnasio por hoy');
					retado.challengers.push(user.userid);
					return this.sendReply('Has enviado tu desafio al lider ' + retado.name + '. Tu turno es: ' + retado.challengers.length);
				} else {
					return this.sendReply('Tu desafio ya ha sido enviado. Espera pacientemente. Tu turno es: ' + (index + 1) + '. Si deseas cancelar tu desafio, utiliza el comando /cancelardesafio ' + retado.name);
				}
			}
		}
	},

	faqliga: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("Haz click <a href='http://pokemon-hispano.comxa.com/showthread.php?tid=250'>aqui</a> para ver como desafiar a la liga.");
	},

	retos: function (target, room, user) {
		if (!user.challengers || user.challengers === []) return this.sendReply('Nadie te ha desafiado. El estado de tu gimnasio es ' + (user.gymopen ? 'abierto.' : 'cerrado.'));
		var nombres = [];
		for (var i = 0; i < user.challengers.length; i++) {
			nombres[i] = tour.username(user.challengers[i]);
		}
		return this.sendReply('Los siguientes usuarios te han desafiado, del mas antiguo al mas reciente: ' + nombres.toString());
	},

	apelar: 'appeal',
	appeal: function (target, room, user) {
		if (!Config.allowappeal) return this.sendReply('Esta funcion esta deshabilitada');
		if (!room.decision) return this.sendReply('Solo es posible utilizar este comando en una sala de batalla');
		if (!room.league) return this.sendReply('Esta no es una batalla oficial de liga.');
		if (room.challenged === user.userid) {
			room.appealed = true;
			return this.sendReply('El equipo de tu oponente sera revelado al terminar la batalla para verificar su legalidad.');
		} else {
			return this.sendReply('No tienes autoridad para usar este comando');
		}
	},

	desapelar: 'unappeal',
	unappeal: function (target, room, user) {
		if (!Config.allowappeal) return this.sendReply('Esta funcion esta deshabilitada');
		if (!room.decision) return this.sendReply('Solo es posible utilizar este comando en una sala de batalla');
		if (!room.league) return this.sendReply('Esta no es una batalla oficial de liga');
		if (room.challenged === user.userid) {
			room.appealed = false;
			return this.sendReply('El equipo de tu oponente ya no sera revelado al terminar la batalla.');
		} else {
			return this.sendReply('No tienes autoridad para usar este comando');
		}
	},

	cancelardesafio: 'cancelarreto',
	cancelarreto: function (target, room, user) {
		if (!user.gymopen) {
			target = toId(target);
			var targetUser = Users.get(target);
			if (!targetUser) return this.sendReply('Ese usuario no existe o no esta presente.');
			var challengers = targetUser.challengers;
			if (!challengers) return this.sendReply('Este usuario no tiene retadores.');
			var index = challengers.indexOf(user.userid);
			if (index === -1) {
				return this.sendReply('No estabas desafiando a ' + targetUser.name);
			} else {
				challengers.splice(index, 1);
				return this.sendReply('Has cancelado tu desafio a ' + targetUser.name);
			}
		} else {
			target = toId(target);
			if (!user.challengers || user.challengers === []) return this.sendReply('Nadie te estaba desafiando');
			var index = user.challengers.indexOf(target);
			if (index === -1) return this.sendReply(target + ' no te estaba desafiando. Revisa tu lista de espera con el comando /retos');
			var targetUser = Users.get(target);
			var unfound = (!targetUser || !targetUser.connected);
			if (unfound) {
				user.challengers.splice(index, 1);
				return this.sendReply('El usuario ' + target + ' ha sido eliminado de tu lista de espera');
			} else {
				return this.sendReply('Ese usuario todavia esta en el servidor. Si deseas, puedes cederle el turno a otro de tus retadores hasta que regrese.');
			}
		}
	},

	nuevalista: 'clearlist',
	limpiarlista: 'clearlist',
	clearlist: function (target, room, user) {
		if (!user.challengers || user.challengers === []) return this.sendReply('Nadie te estaba desafiando');
		if (!target) {
			var cleared = [];
			for (var i = 0; i < user.challengers.length;) {
				var loopid = user.challengers[i];
				var loopuser = Users.get(loopid);
				var unfound = (!loopuser || !loopuser.connected);
				if (unfound) {
					cleared.push(loopid);
					user.challengers.splice(i, 1);
				} else {
					i++;
				}
			}
			if (cleared === []) return this.sendReply('Ninguno de tus retadores estaba inactivo.');
			return this.sendReply('Los siguientes retadores han sido eliminados de tu lista de espera: ' + cleared.toString());
		} else if (target === 'all') {
			user.challengers = [];
			return this.sendReply('Tu lista de espera ha sido vaciada');
		} else {
			return this.sendReply(target + ' no es un parametro valido. Si deseas eliminar toda tu lista de espera, utiliza el comando /clearlist all. Si quieres eliminar de tu lista a un retador en particular, utiliza el comando /cancelardesafio [nombre]');
		}
	},

	gymkick: function (target, room, user) {
		if (!room.decision) return this.sendReply('Solo es posible utilizar este comando en una sala de batalla');
		if (!room.league) return this.sendReply('Esta no es una batalla oficial de liga');
		if (room.challenged !== user.userid) return this.sendReply('No tienes autoridad para usar este comando');
		target = toId(target);
		if (target === room.challenged || target === room.challenger) return this.sendReply('No abuses de este comando');
		targetUser = Users.get(target);
		if (room.users[target]) {
			targetUser.leaveRoom(room);
			targetUser.popup(user.name + ' te ha expulsado de su gimnasio.');
			return this.sendReply('El espectador ' + targetUser.name + ' ha sido expulsado de esta sala de batalla. Si te habia desafiado y deseas anular su reto, utiliza el comando /cancelardesafio ' + targetUser.name);
		} else {
			return this.sendReply('Ese usuario no esta observando la batalla.');
		}
	},

	cerrarinscripciones: 'closereg',
	cerrarinscripcion: 'closereg',
	closereg: function (target, room, user) {
		var auxlider = tour.lideres().indexOf(user.userid);
		var auxelite = tour.altomando().indexOf(user.userid);
		if (auxlider > -1 || auxelite > -1) {
			user.noinscription = true;
			if (Rooms.rooms.lobby) Rooms.rooms.lobby.addRaw('<b>' + user.name + ', ' + tour.cargos()[auxlider] + ', solo luchara contra aquellos que se han inscrito apropiadamente hasta ahora.');
			if (Rooms.rooms.ligapokemonhispano) Rooms.rooms.ligapokemonhispano.addRaw('<b>' + user.name + ', ' + tour.cargos()[auxlider] + ', solo luchara contra aquellos que se han  inscrito apropiadamente hasta ahora.');
			return this.sendReply('Has cerrado la inscripcion para luchar en tu gimnasio. Si deseas reabrirla, utiliza el comando /abririnscripcion');
		} else if (auxelite > -1) {
			user.noinscription = true;
			if (Rooms.rooms.lobby) Rooms.rooms.lobby.addRaw('<b>' + user.name + ', Miembro del Alto Mando de la Liga Pokemon Hispano, solo luchara contra aquellos que se han inscrito apropiadamente hasta ahora.');
			if (Rooms.rooms.ligapokemonhispano) Rooms.rooms.ligapokemonhispano.addRaw('<b>' + user.name + ', Miembro del Alto Mando de la Liga Pokemon Hispano, solo luchara contra aquellos que se han inscrito apropiadamente hasta ahora.');
			return this.sendReply('Has cerrado la inscripcion para luchar contra ti. Si deseas reabrirla, utiliza el comando /abririnscripcion');
		} else {
			return this.sendReply('Desde cuando eres lider? Verifica si tu ID esta  registrado ante la Liga con el comando /lideresid. Tu ID actual es ' + user.userid);
		}
	},

	abririnscripciones: 'openreg',
	abririnscripcion: 'openreg',
	openreg: function (target, room, user) {
		var auxlider = tour.lideres().indexOf(user.userid);
		var auxelite = tour.altomando().indexOf(user.userid);
		if (auxlider > -1 || auxelite > -1) {
			user.noinscription = false;
			if (Rooms.rooms.lobby) Rooms.rooms.lobby.addRaw('<b>' + user.name + ', ' + tour.cargos()[auxlider] + ', ha reabierto la inscripcion para luchar contra el.');
			if (Rooms.rooms.ligapokemonhispano) Rooms.rooms.ligapokemonhispano.addRaw('<b>' + user.name + ', ' + tour.cargos()[auxlider] + ', ha reabierto la inscripcion para luchar contra el.');
			return this.sendReply('Has abierto la inscripcion para luchar en tu gimnasio. Si deseas cerrarla, utiliza el comando /cerrarinscripcion');
		} else if (auxelite > -1) {
			user.noinscription = false;
			if (Rooms.rooms.lobby) Rooms.rooms.lobby.addRaw('<b>' + user.name + ', Miembro del Alto Mando de la Liga Pokemon Hispano, ha reabierto la inscripcion para luchar contra el.');
			if (Rooms.rooms.ligapokemonhispano) Rooms.rooms.ligapokemonhispano.addRaw('<b>' + user.name + ',  Miembro del Alto Mando de la Liga Pokemon Hispano, ha reabierto la inscripcion para luchar contra el.');
			return this.sendReply('Has abierto la inscripcion para luchar contra ti.  Si deseas cerrarla, utiliza el comando /cerrarinscripcion');
		} else {
			return this.sendReply('Desde cuando eres lider? Verifica si tu ID esta registrado ante la Liga con el comando /lideresid. Tu ID actual es ' + user.userid);
		}
	},

	/*********************************************************
	 * Shortcuts
	 *********************************************************/

	invite: function (target, room, user) {
		target = this.splitTarget(target);
		if (!this.targetUser) {
			return this.sendReply("User " + this.targetUsername + " not found.");
		}
		var roomid = (target || room.id);
		if (!Rooms.get(roomid)) {
			return this.sendReply("Room " + roomid + " not found.");
		}
		return this.parse('/msg ' + this.targetUsername + ', /invite ' + roomid);
	},

	/*********************************************************
	 * Informational commands
	 *********************************************************/

	pstats: 'data',
	stats: 'data',
	dex: 'data',
	pokedex: 'data',
	details: 'data',
	dt: 'data',
	data: function (target, room, user, connection, cmd) {
		if (!this.canBroadcast()) return;

		var buffer = '';
		var targetId = toId(target);
		if (targetId === '' + parseInt(targetId)) {
			for (var p in Tools.data.Pokedex) {
				var pokemon = Tools.getTemplate(p);
				if (pokemon.num == parseInt(target)) {
					target = pokemon.species;
					targetId = pokemon.id;
					break;
				}
			}
		}
		var newTargets = Tools.dataSearch(target);
		var showDetails = (cmd === 'dt' || cmd === 'details');
		if (newTargets && newTargets.length) {
			for (var i = 0; i < newTargets.length; ++i) {
				if (newTargets[i].id !== targetId && !Tools.data.Aliases[targetId] && !i) {
					buffer = "No Pokemon, item, move, ability or nature named '" + target + "' was found. Showing the data of '" + newTargets[0].name + "' instead.\n";
				}
				if (newTargets[i].searchType === 'nature') {
					buffer += "" + newTargets[i].name + " nature: ";
					if (newTargets[i].plus) {
						var statNames = {'atk': "Attack", 'def': "Defense", 'spa': "Special Attack", 'spd': "Special Defense", 'spe': "Speed"};
						buffer += "+10% " + statNames[newTargets[i].plus] + ", -10% " + statNames[newTargets[i].minus] + ".";
					} else {
						buffer += "No effect.";
					}
					return this.sendReply(buffer);
				} else {
					buffer += '|c|~|/data-' + newTargets[i].searchType + ' ' + newTargets[i].name + '\n';
				}
			}
		} else {
			return this.sendReply("No Pokemon, item, move, ability or nature named '" + target + "' was found. (Check your spelling?)");
		}

		if (showDetails) {
			var details;
			if (newTargets[0].searchType === 'pokemon') {
				var pokemon = Tools.getTemplate(newTargets[0].name);
				var weighthit = 20;
				if (pokemon.weightkg >= 200) {
					weighthit = 120;
				} else if (pokemon.weightkg >= 100) {
					weighthit = 100;
				} else if (pokemon.weightkg >= 50) {
					weighthit = 80;
				} else if (pokemon.weightkg >= 25) {
					weighthit = 60;
				} else if (pokemon.weightkg >= 10) {
					weighthit = 40;
				}
				details = {
					"Dex#": pokemon.num,
					"Height": pokemon.heightm + " m",
					"Weight": pokemon.weightkg + " kg <em>(" + weighthit + " BP)</em>",
					"Dex Colour": pokemon.color,
					"Egg Group(s)": pokemon.eggGroups.join(", ")
				};
				if (!pokemon.evos.length) {
					details["<font color=#585858>Does Not Evolve</font>"] = "";
				} else {
					details["Evolution"] = pokemon.evos.map(function (evo) {
						evo = Tools.getTemplate(evo);
						return evo.name + " (" + evo.evoLevel + ")";
					}).join(", ");
				}

			} else if (newTargets[0].searchType === 'move') {
				var move = Tools.getMove(newTargets[0].name);
				details = {
					"Priority": move.priority,
				};

				if (move.secondary || move.secondaries) details["<font color=black>&#10003; Secondary Effect</font>"] = "";
				if (move.isContact) details["<font color=black>&#10003; Contact</font>"] = "";
				if (move.isSoundBased) details["<font color=black>&#10003; Sound</font>"] = "";
				if (move.isBullet) details["<font color=black>&#10003; Bullet</font>"] = "";
				if (move.isPulseMove) details["<font color=black>&#10003; Pulse</font>"] = "";

				details["Target"] = {
					'normal': "Adjacent Pokemon",
					'self': "Self",
					'adjacentAlly': "Single Ally",
					'allAdjacentFoes': "Adjacent Foes",
					'foeSide': "All Foes",
					'allySide': "All Allies",
					'allAdjacent': "All Adjacent Pokemon",
					'any': "Any Pokemon",
					'all': "All Pokemon"
				}[move.target] || "Unknown";

			} else if (newTargets[0].searchType === 'item') {
				var item = Tools.getItem(newTargets[0].name);
				details = {};
				if (item.fling) {
					details["Fling Base Power"] = item.fling.basePower;
					if (item.fling.status) details["Fling Effect"] = item.fling.status;
					if (item.fling.volatileStatus) details["Fling Effect"] = item.fling.volatileStatus;
					if (item.isBerry) details["Fling Effect"] = "Activates effect of berry on target.";
					if (item.id === 'whiteherb') details["Fling Effect"] = "Removes all negative stat levels on the target.";
					if (item.id === 'mentalherb') details["Fling Effect"] = "Removes the effects of infatuation, Taunt, Encore, Torment, Disable, and Cursed Body on the target.";
				}
				if (!item.fling) details["Fling"] = "This item cannot be used with Fling";
				if (item.naturalGift) {
					details["Natural Gift Type"] = item.naturalGift.type;
					details["Natural Gift BP"] = item.naturalGift.basePower;
				}

			} else {
				details = {};
			}

			buffer += '|raw|<font size="1">' + Object.keys(details).map(function (detail) {
				return '<font color=#585858>' + detail + (details[detail] !== '' ? ':</font> ' + details[detail] : '</font>');
			}).join("&nbsp;|&ThickSpace;") + '</font>';
		}
		this.sendReply(buffer);
	},

	ds: 'dexsearch',
	dsearch: 'dexsearch',
	dexsearch: function (target, room, user) {
		if (!this.canBroadcast()) return;

		if (!target) return this.parse('/help dexsearch');
		var targets = target.split(',');
		var searches = {};
		var allTiers = {'uber':1, 'ou':1, 'uu':1, 'lc':1, 'cap':1, 'bl':1, 'bl2':1, 'ru':1, 'bl3':1, 'nu':1};
		var allColours = {'green':1, 'red':1, 'blue':1, 'white':1, 'brown':1, 'yellow':1, 'purple':1, 'pink':1, 'gray':1, 'black':1};
		var showAll = false;
		var megaSearch = null;
		var feSearch = null; // search for fully evolved pokemon only
		var output = 10;

		for (var i in targets) {
			var isNotSearch = false;
			target = targets[i].trim().toLowerCase();
			if (target.slice(0, 1) === '!') {
				isNotSearch = true;
				target = target.slice(1);
			}

			var targetAbility = Tools.getAbility(targets[i]);
			if (targetAbility.exists) {
				if (!searches['ability']) searches['ability'] = {};
				if (Object.count(searches['ability'], true) === 1 && !isNotSearch) return this.sendReplyBox("Specify only one ability.");
				if ((searches['ability'][targetAbility.name] && isNotSearch) || (searches['ability'][targetAbility.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include an ability.");
				searches['ability'][targetAbility.name] = !isNotSearch;
				continue;
			}

			if (target in allTiers) {
				if (!searches['tier']) searches['tier'] = {};
				if ((searches['tier'][target] && isNotSearch) || (searches['tier'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a tier.');
				searches['tier'][target] = !isNotSearch;
				continue;
			}

			if (target in allColours) {
				if (!searches['color']) searches['color'] = {};
				if ((searches['color'][target] && isNotSearch) || (searches['color'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a color.');
				searches['color'][target] = !isNotSearch;
				continue;
			}

			var targetInt = parseInt(target);
			if (0 < targetInt && targetInt < 7) {
				if (!searches['gen']) searches['gen'] = {};
				if ((searches['gen'][target] && isNotSearch) || (searches['gen'][target] === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include a generation.');
				searches['gen'][target] = !isNotSearch;
				continue;
			}

			if (target === 'all') {
				if (this.broadcasting) {
					return this.sendReplyBox("A search with the parameter 'all' cannot be broadcast.");
				}
				showAll = true;
				continue;
			}

			if (target === 'megas' || target === 'mega') {
				if ((megaSearch && isNotSearch) || (megaSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include Mega Evolutions.');
				megaSearch = !isNotSearch;
				continue;
			}

			if (target === 'fe' || target === 'fullyevolved' || target === 'nfe' || target === 'notfullyevolved') {
				if (target === 'nfe' || target === 'notfullyevolved') isNotSearch = !isNotSearch;
				if ((feSearch && isNotSearch) || (feSearch === false && !isNotSearch)) return this.sendReplyBox('A search cannot both exclude and include fully evolved Pokémon.');
				feSearch = !isNotSearch;
				continue;
			}

			var targetMove = Tools.getMove(target);
			if (targetMove.exists) {
				if (!searches['moves']) searches['moves'] = {};
				if (Object.count(searches['moves'], true) === 4 && !isNotSearch) return this.sendReplyBox("Specify a maximum of 4 moves.");
				if ((searches['moves'][targetMove.name] && isNotSearch) || (searches['moves'][targetMove.name] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a move.");
				searches['moves'][targetMove.name] = !isNotSearch;
				continue;
			}

			if (target.indexOf(' type') > -1) {
				target = target.charAt(0).toUpperCase() + target.slice(1, target.indexOf(' type'));
				if (target in Tools.data.TypeChart) {
					if (!searches['types']) searches['types'] = {};
					if (Object.count(searches['types'], true) === 2 && !isNotSearch) return this.sendReplyBox("Specify a maximum of two types.");
					if ((searches['types'][target] && isNotSearch) || (searches['types'][target] === false && !isNotSearch)) return this.sendReplyBox("A search cannot both exclude and include a type.");
					searches['types'][target] = !isNotSearch;
					continue;
				}
			}
			return this.sendReplyBox("'" + Tools.escapeHTML(target) + "' could not be found in any of the search categories.");
		}

		if (showAll && Object.size(searches) === 0 && megaSearch === null && feSearch === null) return this.sendReplyBox("No search parameters other than 'all' were found. Try '/help dexsearch' for more information on this command.");

		var dex = {};
		for (var pokemon in Tools.data.Pokedex) {
			var template = Tools.getTemplate(pokemon);
			var megaSearchResult = (megaSearch === null || (megaSearch === true && template.isMega) || (megaSearch === false && !template.isMega));
			var feSearchResult = (feSearch === null || (feSearch === true && !template.evos.length) || (feSearch === false && template.evos.length));
			if (template.tier !== 'Unreleased' && template.tier !== 'Illegal' && (template.tier !== 'CAP' || (searches['tier'] && searches['tier']['cap'])) &&
				megaSearchResult && feSearchResult) {
				dex[pokemon] = template;
			}
		}

		for (var search in {'moves':1, 'types':1, 'ability':1, 'tier':1, 'gen':1, 'color':1}) {
			if (!searches[search]) continue;
			switch (search) {
				case 'types':
					for (var mon in dex) {
						if (Object.count(searches[search], true) === 2) {
							if (!(searches[search][dex[mon].types[0]]) || !(searches[search][dex[mon].types[1]])) delete dex[mon];
						} else {
							if (searches[search][dex[mon].types[0]] === false || searches[search][dex[mon].types[1]] === false || (Object.count(searches[search], true) > 0 &&
								(!(searches[search][dex[mon].types[0]]) && !(searches[search][dex[mon].types[1]])))) delete dex[mon];
						}
					}
					break;

				case 'tier':
					for (var mon in dex) {
						if ('lc' in searches[search]) {
							// some LC legal Pokemon are stored in other tiers (Ferroseed/Murkrow etc)
							// this checks for LC legality using the going criteria, instead of dex[mon].tier
							var isLC = (dex[mon].evos && dex[mon].evos.length > 0) && !dex[mon].prevo && Tools.data.Formats['lc'].banlist.indexOf(dex[mon].species) === -1;
							if ((searches[search]['lc'] && !isLC) || (!searches[search]['lc'] && isLC)) {
								delete dex[mon];
								continue;
							}
						}
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];
					}
					break;

				case 'gen':
				case 'color':
					for (var mon in dex) {
						if (searches[search][String(dex[mon][search]).toLowerCase()] === false) {
							delete dex[mon];
						} else if (Object.count(searches[search], true) > 0 && !searches[search][String(dex[mon][search]).toLowerCase()]) delete dex[mon];					}
					break;

				case 'ability':
					for (var mon in dex) {
						for (var ability in searches[search]) {
							var needsAbility = searches[search][ability];
							var hasAbility = Object.count(dex[mon].abilities, ability) > 0;
							if (hasAbility !== needsAbility) {
								delete dex[mon];
								break;
							}
						}
					}
					break;

				case 'moves':
					for (var mon in dex) {
						var template = Tools.getTemplate(dex[mon].id);
						if (!template.learnset) template = Tools.getTemplate(template.baseSpecies);
						if (!template.learnset) continue;
						for (var i in searches[search]) {
							var move = Tools.getMove(i);
							if (!move.exists) return this.sendReplyBox("'" + move + "' is not a known move.");
							var prevoTemp = Tools.getTemplate(template.id);
							while (prevoTemp.prevo && prevoTemp.learnset && !(prevoTemp.learnset[move.id])) {
								prevoTemp = Tools.getTemplate(prevoTemp.prevo);
							}
							var canLearn = (prevoTemp.learnset.sketch && !(move.id in {'chatter':1, 'struggle':1, 'magikarpsrevenge':1})) || prevoTemp.learnset[move.id];
							if ((!canLearn && searches[search][i]) || (searches[search][i] === false && canLearn)) delete dex[mon];
						}
					}
					break;

				default:
					return this.sendReplyBox("Something broke! PM TalkTakesTime here or on the Smogon forums with the command you tried.");
			}
		}

		var results = Object.keys(dex).map(function (speciesid) {return dex[speciesid].species;});
		results = results.filter(function (species) {
			var template = Tools.getTemplate(species);
			return !(species !== template.baseSpecies && results.indexOf(template.baseSpecies) > -1);
		});
		var resultsStr = "";
		if (results.length > 0) {
			if (showAll || results.length <= output) {
				results.sort();
				resultsStr = results.join(", ");
			} else {
				results.randomize();
				resultsStr = results.slice(0, 10).join(", ") + ", and " + string(results.length - output) + " more. Redo the search with 'all' as a search parameter to show all results.";
			}
		} else {
			resultsStr = "No Pokémon found.";
		}
		return this.sendReplyBox(resultsStr);
	},

	learnset: 'learn',
	learnall: 'learn',
	learn5: 'learn',
	g6learn: 'learn',
	learn: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help learn');

		if (!this.canBroadcast()) return;

		var lsetData = {set:{}};
		var targets = target.split(',');
		var template = Tools.getTemplate(targets[0]);
		var move = {};
		var problem;
		var all = (cmd === 'learnall');
		if (cmd === 'learn5') lsetData.set.level = 5;
		if (cmd === 'g6learn') lsetData.format = {noPokebank: true};

		if (!template.exists) {
			return this.sendReply("Pokemon '" + template.id + "' not found.");
		}

		if (targets.length < 2) {
			return this.sendReply("You must specify at least one move.");
		}

		for (var i = 1, len = targets.length; i < len; ++i) {
			move = Tools.getMove(targets[i]);
			if (!move.exists) {
				return this.sendReply("Move '" + move.id + "' not found.");
			}
			problem = TeamValidator.checkLearnsetSync(null, move, template, lsetData);
			if (problem) break;
		}
		var buffer = template.name + (problem ? " <span class=\"message-learn-cannotlearn\">can't</span> learn " : " <span class=\"message-learn-canlearn\">can</span> learn ") + (targets.length > 2 ? "these moves" : move.name);
		if (!problem) {
			var sourceNames = {E:"egg", S:"event", D:"dream world"};
			if (lsetData.sources || lsetData.sourcesBefore) buffer += " only when obtained from:<ul class=\"message-learn-list\">";
			if (lsetData.sources) {
				var sources = lsetData.sources.sort();
				var prevSource;
				var prevSourceType;
				var prevSourceCount = 0;
				for (var i = 0, len = sources.length; i < len; ++i) {
					var source = sources[i];
					if (source.substr(0, 2) === prevSourceType) {
						if (prevSourceCount < 0) {
							buffer += ": " + source.substr(2);
						} else if (all || prevSourceCount < 3) {
							buffer += ", " + source.substr(2);
						} else if (prevSourceCount === 3) {
							buffer += ", ...";
						}
						++prevSourceCount;
						continue;
					}
					prevSourceType = source.substr(0, 2);
					prevSourceCount = source.substr(2) ? 0 : -1;
					buffer += "<li>gen " + source.substr(0, 1) + " " + sourceNames[source.substr(1, 1)];
					if (prevSourceType === '5E' && template.maleOnlyHidden) buffer += " (cannot have hidden ability)";
					if (source.substr(2)) buffer += ": " + source.substr(2);
				}
			}
			if (lsetData.sourcesBefore) buffer += "<li>any generation before " + (lsetData.sourcesBefore + 1);
			buffer += "</ul>";
		}
		this.sendReplyBox(buffer);
	},

	weak: 'weakness',
	resist: 'weakness',
	weakness: function (target, room, user){
		if (!this.canBroadcast()) return;
		var targets = target.split(/[ ,\/]/);

		var pokemon = Tools.getTemplate(target);
		var type1 = Tools.getType(targets[0]);
		var type2 = Tools.getType(targets[1]);

		if (pokemon.exists) {
			target = pokemon.species;
		} else if (type1.exists && type2.exists) {
			pokemon = {types: [type1.id, type2.id]};
			target = type1.id + "/" + type2.id;
		} else if (type1.exists) {
			pokemon = {types: [type1.id]};
			target = type1.id;
		} else {
			return this.sendReplyBox("" + Tools.escapeHTML(target) + " isn't a recognized type or pokemon.");
		}

		var weaknesses = [];
		var resistances = [];
		var immunities = [];
		Object.keys(Tools.data.TypeChart).forEach(function (type) {
			var notImmune = Tools.getImmunity(type, pokemon);
			if (notImmune) {
				var typeMod = Tools.getEffectiveness(type, pokemon);
				switch (typeMod) {
				case 1:
					weaknesses.push(type);
					break;
				case 2:
					weaknesses.push("<b>" + type + "</b>");
					break;
				case -1:
					resistances.push(type);
					break;
				case -2:
					resistances.push("<b>" + type + "</b>");
					break;
				}
			} else {
				immunities.push(type);
			}
		});

		var buffer = [];
		buffer.push(pokemon.exists ? "" + target + ' (ignoring abilities):' : '' + target + ':');
		buffer.push('<span class=\"message-effect-weak\">Weaknesses</span>: ' + (weaknesses.join(', ') || 'None'));
		buffer.push('<span class=\"message-effect-resist\">Resistances</span>: ' + (resistances.join(', ') || 'None'));
		buffer.push('<span class=\"message-effect-immune\">Immunities</span>: ' + (immunities.join(', ') || 'None'));
		this.sendReplyBox(buffer.join('<br>'));
	},

	eff: 'effectiveness',
	type: 'effectiveness',
	matchup: 'effectiveness',
	effectiveness: function (target, room, user) {
		var targets = target.split(/[,/]/).slice(0, 2);
		if (targets.length !== 2) return this.sendReply("Attacker and defender must be separated with a comma.");

		var searchMethods = {'getType':1, 'getMove':1, 'getTemplate':1};
		var sourceMethods = {'getType':1, 'getMove':1};
		var targetMethods = {'getType':1, 'getTemplate':1};
		var source;
		var defender;
		var foundData;
		var atkName;
		var defName;
		for (var i = 0; i < 2; ++i) {
			var method;
			for (method in searchMethods) {
				foundData = Tools[method](targets[i]);
				if (foundData.exists) break;
			}
			if (!foundData.exists) return this.parse('/help effectiveness');
			if (!source && method in sourceMethods) {
				if (foundData.type) {
					source = foundData;
					atkName = foundData.name;
				} else {
					source = foundData.id;
					atkName = foundData.id;
				}
				searchMethods = targetMethods;
			} else if (!defender && method in targetMethods) {
				if (foundData.types) {
					defender = foundData;
					defName = foundData.species + " (not counting abilities)";
				} else {
					defender = {types: [foundData.id]};
					defName = foundData.id;
				}
				searchMethods = sourceMethods;
			}
		}

		if (!this.canBroadcast()) return;

		var factor = 0;
		if (Tools.getImmunity(source.type || source, defender)) {
			if (source.effectType !== 'Move' || source.basePower || source.basePowerCallback) {
				factor = Math.pow(2, Tools.getEffectiveness(source, defender));
			} else {
				factor = 1;
			}
		}

		this.sendReplyBox("" + atkName + " is " + factor + "x effective against " + defName + ".");
	},

	uptime: function (target, room, user) {
		if (!this.canBroadcast()) return;
		var uptime = process.uptime();
		var uptimeText;
		if (uptime > 24 * 60 * 60) {
			var uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			var uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
		} else {
			uptimeText = uptime.seconds().duration();
		}
		this.sendReplyBox("Uptime: <b>" + uptimeText + "</b>");
	},

	groups: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(Config.groups.byRank.reduce(function (info, group) {
			if (!Config.groups.bySymbol[group].name || !Config.groups.bySymbol[group].description)
				return info;
			return info + (info ? "<br />" : "") + Tools.escapeHTML(group) + " <strong>" + Tools.escapeHTML(Config.groups.bySymbol[group].name) + "</strong> - " + Tools.escapeHTML(Config.groups.bySymbol[group].description);
		}, ""));
	},

	git: 'opensource',
	opensource: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown is open source:<br />" +
			"- Language: JavaScript (Node.js)<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/commits/master\">What's new?</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown\">Server source code</a><br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown-Client\">Client source code</a>"
		);
	},

	staff: function (target, room, user) {
	    if (!this.canBroadcast()) return;
	    this.sendReplyBox("<a href=\"https://www.smogon.com/sim/staff_list\">Pokemon Showdown Staff List</a>");
	},

	avatars: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You can <button name="avatars">change your avatar</button> by clicking on it in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right. Custom avatars are only obtainable by staff.');
	},

	showtan: function (target, room, user) {
		if (room.id !== 'showderp') return this.sendReply("The command '/showtan' was unrecognized. To send a message starting with '/showtan', type '//showtan'.");
		if (!this.can('showtan', room)) return;
		target = this.splitTarget(target);
		if (!this.targetUser) return this.sendReply('user not found');
		if (!room.users[this.targetUser.userid]) return this.sendReply('not a showderper');
		this.targetUser.avatar = '#showtan';
		room.add(user.name+' applied showtan to affected area of '+this.targetUser.name);
	},

	introduction: 'intro',
	intro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"New to competitive pokemon?<br />" +
			"- <a href=\"https://www.smogon.com/sim/ps_guide\">Beginner's Guide to Pokémon Showdown</a><br />" +
			"- <a href=\"https://www.smogon.com/dp/articles/intro_comp_pokemon\">An introduction to competitive Pokémon</a><br />" +
			"- <a href=\"https://www.smogon.com/bw/articles/bw_tiers\">What do 'OU', 'UU', etc mean?</a><br />" +
			"- <a href=\"https://www.smogon.com/xyhub/tiers\">What are the rules for each format? What is 'Sleep Clause'?</a>"
		);
	},

	mentoring: 'smogintro',
	smogonintro: 'smogintro',
	smogintro: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Welcome to Smogon's official simulator! Here are some useful links to <a href=\"https://www.smogon.com/mentorship/\">Smogon\'s Mentorship Program</a> to help you get integrated into the community:<br />" +
			"- <a href=\"https://www.smogon.com/mentorship/primer\">Smogon Primer: A brief introduction to Smogon's subcommunities</a><br />" +
			"- <a href=\"https://www.smogon.com/mentorship/introductions\">Introduce yourself to Smogon!</a><br />" +
			"- <a href=\"https://www.smogon.com/mentorship/profiles\">Profiles of current Smogon Mentors</a><br />" +
			"- <a href=\"http://mibbit.com/#mentor@irc.synirc.net\">#mentor: the Smogon Mentorship IRC channel</a>"
		);
	},

	calculator: 'calc',
	calc: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Pokemon Showdown! damage calculator. (Courtesy of Honko)<br />" +
			"- <a href=\"https://pokemonshowdown.com/damagecalc/\">Damage Calculator</a>"
		);
	},

	cap: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"An introduction to the Create-A-Pokemon project:<br />" +
			"- <a href=\"https://www.smogon.com/cap/\">CAP project website and description</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/showthread.php?t=48782\">What Pokemon have been made?</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/showthread.php?t=3464513\">Talk about the metagame here</a><br />" +
			"- <a href=\"https://www.smogon.com/forums/showthread.php?t=3466826\">Practice BW CAP teams</a>"
		);
	},

	gennext: function (target, room, user) {
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"NEXT (also called Gen-NEXT) is a mod that makes changes to the game:<br />" +
			"- <a href=\"https://github.com/Zarel/Pokemon-Showdown/blob/master/mods/gennext/README.md\">README: overview of NEXT</a><br />" +
			"Example replays:<br />" +
			"- <a href=\"https://replay.pokemonshowdown.com/gennextou-120689854\">Zergo vs Mr Weegle Snarf</a><br />" +
			"- <a href=\"https://replay.pokemonshowdown.com/gennextou-130756055\">NickMP vs Khalogie</a>"
		);
	},

	om: 'othermetas',
	othermetas: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/forums/206/\">Other Metagames Forum</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3505031/\">Other Metagames Index</a><br />";
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3507466/\">Sample teams for entering Other Metagames</a><br />";
			}
		}
		if (target === 'omofthemonth' || target === 'omotm' || target === 'month') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3481155/\">OM of the Month</a><br />";
		}
		if (target === 'pokemonthrowback' || target === 'throwback') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3510401/\">Pokémon Throwback</a><br />";
		}
		if (target === 'balancedhackmons' || target === 'bh') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3489849/\">Balanced Hackmons</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3499973/\">Balanced Hackmons Mentoring Program</a><br />";
			}
		}
		if (target === '1v1') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496773/\">1v1</a><br />";
		}
		if (target === 'oumonotype' || target === 'monotype') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493087/\">OU Monotype</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3507565/\">OU Monotype Viability Rankings</a><br />";
			}
		}
		if (target === 'tiershift' || target === 'ts') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508369/\">Tier Shift</a><br />";
		}
		if (target === 'almostanyability' || target === 'aaa') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3495737/\">Almost Any Ability</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508794/\">Almost Any Ability Viability Rankings</a><br />";
			}
		}
		if (target === 'stabmons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493081/\">STABmons</a><br />";
			if (target !== 'all') {
				buffer += "- <a href=\"https://www.smogon.com/forums/threads/3512215/\">STABmons Viability Rankings</a><br />";
			}
		}
		if (target === 'skybattles' || target === 'skybattle') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3493601/\">Sky Battles</a><br />";
		}
		if (target === 'inversebattle' || target === 'inverse') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3492433/\">Inverse Battle</a><br />";
		}
		if (target === 'smogontriples' || target === 'triples') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3511522/\">Smogon Triples</a><br />";
		}
		if (target === 'alphabetcup') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3498167/\">Alphabet Cup</a><br />";
		}
		if (target === 'averagemons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3495527/\">Averagemons</a><br />";
		}
		if (target === 'hackmons' || target === 'purehackmons' || target === 'classichackmons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3500418/\">Hackmons</a><br />";
		}
		if (target === 'middlecup' || target === 'mc') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3494887/\">Middle Cup</a><br />";
		}
		if (target === 'glitchmons') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3467120/\">Glitchmons</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Other Metas entry '" + target + "' was not found. Try /othermetas or /om for general help.");
		}
		this.sendReplyBox(buffer);
	},

	/*formats: 'formathelp',
	formatshelp: 'formathelp',
	formathelp: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (this.broadcasting && (room.id === 'lobby' || room.battle)) return this.sendReply("This command is too spammy to broadcast in lobby/battles");
		var buf = [];
		var showAll = (target === 'all');
		for (var id in Tools.data.Formats) {
			var format = Tools.data.Formats[id];
			if (!format) continue;
			if (format.effectType !== 'Format') continue;
			if (!format.challengeShow) continue;
			if (!showAll && !format.searchShow) continue;
			buf.push({
				name: format.name,
				gameType: format.gameType || 'singles',
				mod: format.mod,
				searchShow: format.searchShow,
				desc: format.desc || 'No description.'
			});
		}
		this.sendReplyBox(
			"Available Formats: (<strong>Bold</strong> formats are on ladder.)<br />" +
			buf.map(function (data) {
				var str = "";
				// Bold = Ladderable.
				str += (data.searchShow ? "<strong>" + data.name + "</strong>" : data.name) + ": ";
				str += "(" + (!data.mod || data.mod === 'base' ? "" : data.mod + " ") + data.gameType + " format) ";
				str += data.desc;
				return str;
			}).join("<br />")
		);
	},*/

	roomhelp: function (target, room, user) {
		if (room.id === 'lobby' || room.battle) return this.sendReply("This command is too spammy for lobby/battles.");
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"Room drivers (%) can use:<br />" +
			"- /warn OR /k <em>username</em>: warn a user and show the Pokemon Showdown rules<br />" +
			"- /mute OR /m <em>username</em>: 7 minute mute<br />" +
			"- /hourmute OR /hm <em>username</em>: 60 minute mute<br />" +
			"- /unmute <em>username</em>: unmute<br />" +
			"- /announce OR /wall <em>message</em>: make an announcement<br />" +
			"- /modlog <em>username</em>: search the moderator log of the room<br />" +
			"- /modnote <em>note</em>: adds a moderator note that can be read through modlog<br />" +
			"<br />" +
			"Room moderators (@) can also use:<br />" +
			"- /roomban OR /rb <em>username</em>: bans user from the room<br />" +
			"- /roomunban <em>username</em>: unbans user from the room<br />" +
			"- /roomvoice <em>username</em>: appoint a room voice<br />" +
			"- /roomdevoice <em>username</em>: remove a room voice<br />" +
			"- /modchat <em>[off/autoconfirmed/+]</em>: set modchat level<br />" +
			"<br />" +
			"Room owners (#) can also use:<br />" +
			"- /roomintro <em>intro</em>: sets the room introduction that will be displayed for all users joining the room<br />" +
			"- /rules <em>rules link</em>: set the room rules link seen when using /rules<br />" +
			"- /roommod, /roomdriver <em>username</em>: appoint a room moderator/driver<br />" +
			"- /roomdemod, /roomdedriver <em>username</em>: remove a room moderator/driver<br />" +
			"- /modchat <em>[%/@/#]</em>: set modchat level<br />" +
			"- /declare <em>message</em>: make a large blue declaration to the room<br />" +
			"- !htmlbox <em>HTML code</em>: broadcasts a box of HTML code to the room<br />" +
			"- !showimage <em>[url], [width], [height]</em>: shows an image to the room<br />" +
			"</div>"
		);
	},

	restarthelp: function (target, room, user) {
		if (room.id === 'lobby' && !this.can('lockdown')) return false;
		if (!this.canBroadcast()) return;
		this.sendReplyBox(
			"The server is restarting. Things to know:<br />" +
			"- We wait a few minutes before restarting so people can finish up their battles<br />" +
			"- The restart itself will take around 0.6 seconds<br />" +
			"- Your ladder ranking and teams will not change<br />" +
			"- We are restarting to update Pokémon Showdown to a newer version"
		);
	},

	rule: 'rules',
	rules: function (target, room, user) {
		if (!target) {
			if (!this.canBroadcast()) return;
			this.sendReplyBox("Please follow the rules:<br />" +
				(room.rulesLink ? "- <a href=\"" + Tools.escapeHTML(room.rulesLink) + "\">" + Tools.escapeHTML(room.title) + " room rules</a><br />" : "") +
				"- <a href=\"https://pokemonshowdown.com/rules\">" + (room.rulesLink ? "Global rules" : "Rules") + "</a>");
			return;
		}
		if (!this.can('declare', room)) return;
		if (target.length > 80) {
			return this.sendReply("Error: Room rules link is too long (must be under 80 characters). You can use a URL shortener to shorten the link.");
		}

		room.rulesLink = target.trim();
		this.sendReply("(The room rules link is now: " + target + ")");

		if (room.chatRoomData) {
			room.chatRoomData.rulesLink = room.rulesLink;
			Rooms.global.writeChatRoomData();
		}
	},

	faq: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = target.toLowerCase();
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq\">Frequently Asked Questions</a><br />";
		}
		if (target === 'deviation') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#deviation\">Why did this user gain or lose so many points?</a><br />";
		}
		if (target === 'doubles' || target === 'triples' || target === 'rotation') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#doubles\">Can I play doubles/triples/rotation battles here?</a><br />";
		}
		if (target === 'randomcap') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#randomcap\">What is this fakemon and what is it doing in my random battle?</a><br />";
		}
		if (target === 'restarts') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/faq#restarts\">Why is the server restarting?</a><br />";
		}
		if (target === 'all' || target === 'star' || target === 'player') {
			matched = true;
			buffer += '<a href="http://www.smogon.com/sim/faq#star">Why is there this star (&starf;) behind my username?</a><br />';
		}
		if (target === 'staff') {
			matched = true;
			buffer += "<a href=\"https://www.smogon.com/sim/staff_faq\">Staff FAQ</a><br />";
		}
		if (target === 'autoconfirmed' || target === 'ac') {
			matched = true;
			buffer += "A user is autoconfirmed when they have won at least one rated battle and have been registered for a week or longer.<br />";
		}
		if (!matched) {
			return this.sendReply("The FAQ entry '" + target + "' was not found. Try /faq for general help.");
		}
		this.sendReplyBox(buffer);
	},

	banlists: 'tiers',
	tier: 'tiers',
	tiers: function (target, room, user) {
		if (!this.canBroadcast()) return;
		target = toId(target);
		var buffer = "";
		var matched = false;
		if (!target || target === 'all') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/tiers/\">Smogon Tiers</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/tiering-faq.3498332/\">Tiering FAQ</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/xyhub/tiers\">The banlists for each tier</a><br />";
		}
		if (target === 'ubers' || target === 'uber') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496305/\">Ubers Viability Rankings</a><br />";
		}
		if (target === 'overused' || target === 'ou') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3511596/\">np: OU Stage 5</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3491371/\">OU Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3502428/\">OU Viability Rankings</a><br />";
		}
		if (target === 'underused' || target === 'uu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3508311/\">np: UU Stage 2</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3502698/#post-5323505\">UU Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3500340/\">UU Viability Rankings</a><br />";
		}
		if (target === 'rarelyused' || target === 'ru') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3515615/\">np: RU Stage 4</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3506500/\">RU Viability Rankings</a><br />";
		}
		if (target === 'neverused' || target === 'nu') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3514299/\">np: NU Stage 1</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3509494/\">NU Viability Rankings</a><br />";
		}
		if (target === 'littlecup' || target === 'lc') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496013/\">LC Viability Rankings</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3490462/\">Official LC Banlist</a><br />";
		}
		if (target === 'doubles') {
			matched = true;
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3509279/\">np: Doubles Stage 3.5</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3498688/\">Doubles Banlist</a><br />";
			buffer += "- <a href=\"https://www.smogon.com/forums/threads/3496306/\">Doubles Viability Rankings</a><br />";
		}
		if (!matched) {
			return this.sendReply("The Tiers entry '" + target + "' was not found. Try /tiers for general help.");
		}
		this.sendReplyBox(buffer);
	},

	analysis: 'smogdex',
	strategy: 'smogdex',
	smogdex: function (target, room, user) {
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (toId(targets[0]) === 'previews') return this.sendReplyBox("<a href=\"https://www.smogon.com/forums/threads/sixth-generation-pokemon-analyses-index.3494918/\">Generation 6 Analyses Index</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		var pokemon = Tools.getTemplate(targets[0]);
		var item = Tools.getItem(targets[0]);
		var move = Tools.getMove(targets[0]);
		var ability = Tools.getAbility(targets[0]);
		var atLeastOne = false;
		var generation = (targets[1] || 'xy').trim().toLowerCase();
		var genNumber = 6;
		// var doublesFormats = {'vgc2012':1, 'vgc2013':1, 'vgc2014':1, 'doubles':1};
		var doublesFormats = {};
		var doublesFormat = (!targets[2] && generation in doublesFormats)? generation : (targets[2] || '').trim().toLowerCase();
		var doublesText = '';
		if (generation === 'xy' || generation === 'xy' || generation === '6' || generation === 'six') {
			generation = 'xy';
		} else if (generation === 'bw' || generation === 'bw2' || generation === '5' || generation === 'five') {
			generation = 'bw';
			genNumber = 5;
		} else if (generation === 'dp' || generation === 'dpp' || generation === '4' || generation === 'four') {
			generation = 'dp';
			genNumber = 4;
		} else if (generation === 'adv' || generation === 'rse' || generation === 'rs' || generation === '3' || generation === 'three') {
			generation = 'rs';
			genNumber = 3;
		} else if (generation === 'gsc' || generation === 'gs' || generation === '2' || generation === 'two') {
			generation = 'gs';
			genNumber = 2;
		} else if(generation === 'rby' || generation === 'rb' || generation === '1' || generation === 'one') {
			generation = 'rb';
			genNumber = 1;
		} else {
			generation = 'xy';
		}
		if (doublesFormat !== '') {
			// Smogon only has doubles formats analysis from gen 5 onwards.
			if (!(generation in {'bw':1, 'xy':1}) || !(doublesFormat in doublesFormats)) {
				doublesFormat = '';
			} else {
				doublesText = {'vgc2012':"VGC 2012", 'vgc2013':"VGC 2013", 'vgc2014':"VGC 2014", 'doubles':"Doubles"}[doublesFormat];
				doublesFormat = '/' + doublesFormat;
			}
		}

		// Pokemon
		if (pokemon.exists) {
			atLeastOne = true;
			if (genNumber < pokemon.gen) {
				return this.sendReplyBox("" + pokemon.name + " did not exist in " + generation.toUpperCase() + "!");
			}
			// if (pokemon.tier === 'CAP') generation = 'cap';
			if (pokemon.tier === 'CAP') return this.sendReply("CAP is not currently supported by Smogon Strategic Pokedex.");

			var illegalStartNums = {'351':1, '421':1, '487':1, '493':1, '555':1, '647':1, '648':1, '649':1, '681':1};
			if (pokemon.isMega || pokemon.num in illegalStartNums) pokemon = Tools.getTemplate(pokemon.baseSpecies);
			var poke = pokemon.name.toLowerCase().replace(/\ /g, '_').replace(/[^a-z0-9\-\_]+/g, '');

			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/pokemon/" + poke + doublesFormat + "\">" + generation.toUpperCase() + " " + doublesText + " " + pokemon.name + " analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Item
		if (item.exists && genNumber > 1 && item.gen <= genNumber) {
			atLeastOne = true;
			var itemName = item.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/items/" + itemName + "\">" + generation.toUpperCase() + " " + item.name + " item analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Ability
		if (ability.exists && genNumber > 2 && ability.gen <= genNumber) {
			atLeastOne = true;
			var abilityName = ability.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/abilities/" + abilityName + "\">" + generation.toUpperCase() + " " + ability.name + " ability analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		// Move
		if (move.exists && move.gen <= genNumber) {
			atLeastOne = true;
			var moveName = move.name.toLowerCase().replace(' ', '_');
			this.sendReplyBox("<a href=\"https://www.smogon.com/dex/" + generation + "/moves/" + moveName + "\">" + generation.toUpperCase() + " " + move.name + " move analysis</a>, brought to you by <a href=\"https://www.smogon.com\">Smogon University</a>");
		}

		if (!atLeastOne) {
			return this.sendReplyBox("Pokemon, item, move, or ability not found for generation " + generation.toUpperCase() + ".");
		}
	},

	/*********************************************************
	 * Miscellaneous commands
	 *********************************************************/

	potd: function (target, room, user) {
		if (!this.can('potd')) return false;

		Config.potd = target;
		Simulator.SimulatorProcess.eval('Config.potd = \'' + toId(target) + '\'');
		if (target) {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day is now " + target + "!</b><br />This Pokemon will be guaranteed to show up in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was changed to " + target + " by " + user.name + ".");
		} else {
			if (Rooms.lobby) Rooms.lobby.addRaw("<div class=\"broadcast-blue\"><b>The Pokemon of the Day was removed!</b><br />No pokemon will be guaranteed in random battles.</div>");
			this.logModCommand("The Pokemon of the Day was removed by " + user.name + ".");
		}
	},

	roll: 'dice',
	dice: function (target, room, user) {
		if (!target) return this.parse('/help dice');
		if (!this.canBroadcast()) return;
		var d = target.indexOf("d");
		if (d != -1) {
			var num = parseInt(target.substring(0, d));
			var faces;
			if (target.length > d) faces = parseInt(target.substring(d + 1));
			if (isNaN(num)) num = 1;
			if (isNaN(faces)) return this.sendReply("The number of faces must be a valid integer.");
			if (faces < 1 || faces > 1000) return this.sendReply("The number of faces must be between 1 and 1000");
			if (num < 1 || num > 20) return this.sendReply("The number of dice must be between 1 and 20");
			var rolls = [];
			var total = 0;
			for (var i = 0; i < num; ++i) {
				rolls[i] = (Math.floor(faces * Math.random()) + 1);
				total += rolls[i];
			}
			return this.sendReplyBox("Random number " + num + "x(1 - " + faces + "): " + rolls.join(", ") + "<br />Total: " + total);
		}
		if (target && isNaN(target) || target.length > 21) return this.sendReply("The max roll must be a number under 21 digits.");
		var maxRoll = (target)? target : 6;
		var rand = Math.floor(maxRoll * Math.random()) + 1;
		return this.sendReplyBox("Random number (1 - " + maxRoll + "): " + rand);
	},

	pr: 'pickrandom',
	pick: 'pickrandom',
	pickrandom: function (target, room, user) {
		var options = target.split(',');
		if (options.length < 2) return this.parse('/help pick');
		if (!this.canBroadcast()) return false;
		return this.sendReplyBox('<em>We randomly picked:</em> ' + Tools.escapeHTML(options.sample().trim()));
	},

	register: function () {
		if (!this.canBroadcast()) return;
		this.sendReplyBox('You will be prompted to register upon winning a rated battle. Alternatively, there is a register button in the <button name="openOptions"><i class="icon-cog"></i> Options</button> menu in the upper right.');
	},

	lobbychat: function (target, room, user, connection) {
		if (!Rooms.lobby) return this.popupReply("This server doesn't have a lobby.");
		target = toId(target);
		if (target === 'off') {
			user.leaveRoom(Rooms.lobby, connection.socket);
			connection.send('|users|');
			this.sendReply("You are now blocking lobby chat.");
		} else {
			user.joinRoom(Rooms.lobby, connection);
			this.sendReply("You are now receiving lobby chat.");
		}
	},

	showimage: function (target, room, user) {
		if (!target) return this.parse('/help showimage');
		if (!this.can('declare', room)) return false;
		if (!this.canBroadcast()) return;

		var targets = target.split(',');
		if (targets.length != 3) {
			return this.parse('/help showimage');
		}

		this.sendReply('|raw|<img src="' + Tools.escapeHTML(targets[0]) + '" alt="" width="' + toId(targets[1]) + '" height="' + toId(targets[2]) + '" />');
	},

	htmlbox: function (target, room, user) {
		if (!target) return this.parse('/help htmlbox');
		if (!this.can('declare', room)) return;
		if (!this.canHTML(target)) return;
		if (!this.canBroadcast('!htmlbox')) return;

		this.sendReplyBox(target);
	},

	a: function (target, room, user) {
		if (!this.can('rawpacket')) return false;
		// secret sysop command
		room.add(target);
	},

	/*********************************************************
	 * Custom commands
	 *********************************************************/

	spam: 'spamroom',
	spamroom: function (target, room, user) {
		if (!target) return this.sendReply("Please specify a user.");
		this.splitTarget(target);

		if (!this.targetUser) {
			return this.sendReply("The user '" + this.targetUsername + "' does not exist.");
		}
		if (!this.can('mute', this.targetUser)) {
			return false;
		}

		var targets = Spamroom.addUser(this.targetUser);
		if (targets.length === 0) {
			return this.sendReply("That user's messages are already being redirected to the spamroom.");
		}
		this.privateModCommand("(" + user.name + " has added to the spamroom user list: " + targets.join(", ") + ")");
	},

	unspam: 'unspamroom',
	unspamroom: function (target, room, user) {
		if (!target) return this.sendReply("Please specify a user.");
		this.splitTarget(target);

		if (!this.can('mute')) {
			return false;
		}

		var targets = Spamroom.removeUser(this.targetUser || this.targetUsername);
		if (targets.length === 0) {
			return this.sendReply("That user is not in the spamroom list.");
		}
		this.privateModCommand("(" + user.name + " has removed from the spamroom user list: " + targets.join(", ") + ")");
	},

	customavatars: 'customavatar',
	customavatar: (function () {
		const script = function () {/*
			FILENAME=`mktemp`
			function cleanup {
				rm -f $FILENAME
			}
			trap cleanup EXIT

			set -xe

			timeout 10 wget "$1" -nv -O $FILENAME

			FRAMES=`identify $FILENAME | wc -l`
			if [ $FRAMES -gt 1 ]; then
				EXT=".gif"
			else
				EXT=".png"
			fi

			timeout 10 convert $FILENAME -layers TrimBounds -coalesce -adaptive-resize 80x80\> -background transparent -gravity center -extent 80x80 "$2$EXT"
		*/}.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

		var pendingAdds = {};
		return function (target) {
			var parts = target.split(',');
			var cmd = parts[0].trim().toLowerCase();

			if (cmd in {'':1, show:1, view:1, display:1}) {
				var message = "";
				for (var a in Config.customAvatars)
					message += "<strong>" + Tools.escapeHTML(a) + ":</strong> " + Tools.escapeHTML(Config.customAvatars[a]) + "<br />";
				return this.sendReplyBox(message);
			}

			if (!this.can('customavatar')) return false;

			switch (cmd) {
				case 'set':
					var userid = toId(parts[1]);
					var user = Users.getExact(userid);
					var avatar = parts.slice(2).join(',').trim();

					if (!userid) return this.sendReply("You didn't specify a user.");
					if (Config.customAvatars[userid]) return this.sendReply(userid + " already has a custom avatar.");

					var hash = require('crypto').createHash('sha512').update(userid + '\u0000' + avatar).digest('hex').slice(0, 8);
					pendingAdds[hash] = {userid: userid, avatar: avatar};
					parts[1] = hash;

					if (!user) {
						this.sendReply("Warning: " + userid + " is not online.");
						this.sendReply("If you want to continue, use: /customavatar forceset, " + hash);
						return;
					}

					/* falls through */
				case 'forceset':
					var hash = parts[1].trim();
					if (!pendingAdds[hash]) return this.sendReply("Invalid hash.");

					var userid = pendingAdds[hash].userid;
					var avatar = pendingAdds[hash].avatar;
					delete pendingAdds[hash];

					require('child_process').execFile('bash', ['-c', script, '-', avatar, './config/avatars/' + userid], function (e, out, err) {
						if (e) {
							this.sendReply(userid + "'s custom avatar failed to be set. Script output:");
							(out + err).split('\n').forEach(this.sendReply.bind(this));
							return;
						}

						reloadCustomAvatars();
						this.sendReply(userid + "'s custom avatar has been set.");
					}.bind(this));
					break;

				case 'delete':
					var userid = toId(parts[1]);
					if (!Config.customAvatars[userid]) return this.sendReply(userid + " does not have a custom avatar.");

					if (Config.customAvatars[userid].toString().split('.').slice(0, -1).join('.') !== userid)
						return this.sendReply(userid + "'s custom avatar (" + Config.customAvatars[userid] + ") cannot be removed with this script.");
					require('fs').unlink('./config/avatars/' + Config.customAvatars[userid], function (e) {
						if (e) return this.sendReply(userid + "'s custom avatar (" + Config.customAvatars[userid] + ") could not be removed: " + e.toString());

						delete Config.customAvatars[userid];
						this.sendReply(userid + "'s custom avatar removed successfully");
					}.bind(this));
					break;

				default:
					return this.sendReply("Invalid command. Valid commands are `/customavatar set, user, avatar` and `/customavatar delete, user`.");
			}
		};
	})(),

	/*********************************************************
	 * Clan commands
	 *********************************************************/

	ayudaclan: 'clanshelp',
	clanhelp: 'clanshelp',
	clanshelp: function () {
		if (!this.canBroadcast()) return false;
		this.sendReplyBox(
			"<big><b><font color=navy>✯Comandos de Clanes✯</b></font></big><br /><br />" +
			"/clanes - Muestra la lista de clanes.<br />" +
			"/clan (clan/miembro) - Muestra la ficha/perfil de un clan.<br />" +
			"/miembrosclan (clan/miembro) - muestra los miembros con los que cuenta un clan.<br />" +
			"/clanauth (clan/miembro) - muestra la jerarquía de miembros de un clan.<br />" +
			"/warlog (clan/miembro) - muestra las 10 últimas wars de un clan.<br />" +
			"/invitarclan - Invita a un usuario a unirse al clan. Requiere ser Oficial o Líder del clan.<br />" +
			"/expulsarclan (miembro) - Expulsa a un miembro del clan. Requiere ser Líder del clan.<br />" +
			"/aceptarclan (clan) - Acepta una invitación al clan.<br />" +
			"/invitacionesclan (clan/miembro) - Lista a los usuarios invitados a un clan.<br />" +
			"/borrarinvitaciones - Borra las invitaciones pendientes al Clan. Requiere ser líder del clan.<br />" +
			"/abandonarclan - Abandona el clan.<br />" +
			"<br />" +
			"<big><b><font color=navy>✯Comandos de Clan-Auth✯</b></font></big><br /><br />" +
			"/liderclan (miembro) - Nombra a un miembro líder del clan. <br />" +
			"/oficialclan (miembro) - Nombra a un miembro oficial del clan.<br />" +
			"/demoteclan (miembro) - Borra a un miembro del staff del clan.<br />" +
			"/lemaclan (lema) - Establece el Lema del clan. Requiere ser líder del clan.<br />" +
			"/logoclan (logo) - Establece el Logotipo del clan. Requiere ser líder del clan.<br />" +
			"/closeclanroom - Bloquea una sala de clan a todos los que no sean miembros del clan.<br />" +
			"/openclanroom - Elimina el bloqueo del comando /closeclanroom.<br />" +
			"/rk o /roomkick - Expulsa a un usuario de una sala.<br />" +
			"<br />" +
		"<big><b><font color=navy>✯Comandos de Administrador✯</b></font></big><br /><br />" +
			"/createclan &lt;name> - Crea un clan.<br />" +
			"/deleteclan &lt;name> - Elimina un clan.<br />" +
			"/addclanmember &lt;clan>, &lt;user> - Fuerza a un usuario a unirse a un clan.<br />" +
			"/removeclanmember &lt;clan>, &lt;user> - Expulsa a un usuario del clan.<br />" +
			"/setlemaclan &lt;clan>,&lt;lema> - Establece un lema para un clan.<br />" +
			"/setlogoclan &lt;clan>,&lt;logo> - Establece un logotipo para un clan.<br />" +
			"/setsalaclan &lt;clan>,&lt;sala> - Establece una sala para un clan.<br />" +
			"/setgxeclan &lt;clan>,&lt;wins>,&lt;losses>,&lt;draws> - Establece la puntuación de un clan.<br />" +
			"/serankclan &lt;clan>,&lt;puntos> - Establece la puntuación de un clan.<br />" +
			"/settitleclan &lt;clan>&lt;puntos> - Estable un título para el clan.<br />" +
			"<br />" +
			"<big><b><font color=navy>✯Comandos de Wars✯</font></b></big><br /><br />" +
			"/war &lt;formato>, &lt;tamano>, &lt;clan 1>, &lt;clan 2> - Inicia una war entre 2 clanes.<br />" +
			"/endwar - Finaliza una war.<br />" +
			"/vw - Muestra el estado actual de la war.<br />" +
			"/jw - Comando para unirse a una war.<br />" +
			"/lw - Comando para salir de una war.<br />" +
			"/warkick - Fuerza a un usuario a abandonar una war. Requiere %<br />" +
			"/wardq - Descalifica a un usuario. Requiere % o autoridad en el clan.<br />" +
			"/warreplace &lt;usuario 1>, &lt;usuario 2> - Comando para reemplazar jugadores en la war. Requiere % o autoridad en el clan.<br />" +
			"/warinvalidate &lt;participante> - Cancela el resultado de una batalla de la war. Requiere @<br />"
		);
	},

	createclan: function (target) {
		if (!this.can('clans')) return false;
		if (target.length < 2)
			this.sendReply("El nombre del clan es demasiado corto");
		else if (!Clans.createClan(target))
			this.sendReply("No se pudo crear el clan. Es posible que ya exista otro con el mismo nombre.");
		else
			this.sendReply("Clan: " + target + " creado con éxito.");

	},

	deleteclan: function (target) {
		if (!this.can('clans')) return false;
		if (!Clans.deleteClan(target))
			this.sendReply("No se pudo eliminar el clan. Es posble que no exista o que se encuentre en war.");
		else
			this.sendReply("Clan: " + target + " eliminado con éxito.");
	},

	getclans: 'clans',
	clanes: 'clans',
	clans: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		var clansTableTitle = "Lista de Clanes";
		if (toId(target) === 'rank' || toId(target) === 'puntos') clansTableTitle = "Lista de Clanes por Puntuacion";
		if (toId(target) === 'miembros' || toId(target) === 'members') clansTableTitle = "Lista de Clanes por Miembros";
		var clansTable = '<br /><center><big><big><strong>' + clansTableTitle + '</strong></big></big><center><br /><table class="clanstable" width="100%" border="3"><tr><td><center><strong>Clan</strong></center></td><td><center><strong>Miembros</strong></center></td><td><center><strong>Sala</strong></center></td><td><center><strong>GXE</strong></center></td><td><center><strong>Puntuacion</strong></center></td></tr>';
		var clansList = Clans.getClansList(toId(target));
		var auxRating = {};
		var nMembers = 0;
		var membersClan = {};
		var auxGxe = 0;
		for (var m in clansList) {
			auxRating = Clans.getElementalData(m);
			auxGxe = Math.floor(auxRating.gxe * 100) / 100;
			membersClan = Clans.getMembers(m);
			if (!membersClan) {
				nMembers = 0;
			} else {
				nMembers = membersClan.length;
			}
			clansTable += '<tr><td><center>' + Tools.escapeHTML(Clans.getClanName(m)) + '</center></td><td><center>' + nMembers + '</center></td><td><center>' + '<button name="send" value="/join ' + Tools.escapeHTML(auxRating.sala) + '" target="_blank">' + Tools.escapeHTML(auxRating.sala) + '</button>' + '</center></td><td><center>' + auxGxe + '</center></td><td><center>' + auxRating.rating + '</center></td></tr>';
		}
		clansTable += '</table>';
		this.sendReplyBox(clansTable);
	},

	clanauth: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		//html codes for clan ranks
		var leaderClanSource = Clans.getAuthMembers(target, 2);
		if (leaderClanSource !== "") {
			leaderClanSource = "<big><b>Líderes</b></big><br /><br />" + leaderClanSource + "</b></big></big><br /><br />";
		}
		var oficialClanSource = Clans.getAuthMembers(target, 1);
		if (oficialClanSource !== "") {
			oficialClanSource = "<big><b>Oficiales</b></big><br /><br />" + oficialClanSource + "</b></big></big><br /><br />";
		}
		var memberClanSource = Clans.getAuthMembers(target, false);
		if (memberClanSource !== "") {
			memberClanSource = "<big><b>Miembros</b></big><br /><br />" + memberClanSource + "</b></big></big><br /><br />";
		}

		this.sendReplyBox(
			"<center><big><big><b>Jerarquía del clan " + Tools.escapeHTML(Clans.getClanName(target)) + "</b></big></big> <br /><br />" + leaderClanSource + oficialClanSource + memberClanSource + '</center>'
		);
	},

	clanmembers: 'miembrosclan',
	miembrosclan: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		var nMembers = 0;
		var membersClan = Clans.getMembers(target);
		if (!membersClan) {
			nMembers = 0;
		} else {
			nMembers = membersClan.length;
		}
		this.sendReplyBox(
			"<strong>Miembros del clan " + Tools.escapeHTML(Clans.getClanName(target)) + ":</strong> " + Clans.getAuthMembers(target, "all") + '<br /><br /><strong>Número de miembros: ' + nMembers + '</strong>'
		);
	},
	invitacionesclan: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		this.sendReplyBox(
			"<strong>Invitaciones pendientes del clan " + Tools.escapeHTML(Clans.getClanName(target)) + ":</strong> " + Tools.escapeHTML(Clans.getInvitations(target).sort().join(", "))
		);
	},
	clan: 'getclan',
	getclan: function (target, room, user) {
		var autoClan = false;
		var memberClanProfile = false;
		var clanMember = "";
		if (!target) autoClan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getProfile(target);
		if (!clan) {
			clanMember = target;
			target = Clans.findClanFromMember(target);
			memberClanProfile = true;
			if (target)
				clan = Clans.getProfile(target);
		}
		if (!clan && autoClan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getProfile(target);
			memberClanProfile = true;
			clanMember = user.name;
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		var salaClanSource = "";
		if (clan.sala === "none") {
			salaClanSource = 'Aún no establecida.';
		} else {
			salaClanSource = '<button name="send" value="/join ' + Tools.escapeHTML(clan.sala) + '" target="_blank">' + Tools.escapeHTML(clan.sala) + '</button>';
		}
		var clanTitle = "";
		if (memberClanProfile) {
			var authValue = Clans.authMember(target, clanMember);
			if (authValue === 2) {
				clanTitle = clanMember + " - Líder del clan " + clan.compname;
			} else if (authValue === 1) {
				clanTitle = clanMember + " - Oficial del clan " + clan.compname;
			} else {
				clanTitle = clanMember + " - Miembro del clan " + clan.compname;
			}
		} else {
			clanTitle = clan.compname;
		}
		var medalsClan = '';
		if (clan.medals) {
			for (var u in clan.medals) {
				medalsClan += '<img id="' + u + '" src="' + encodeURI(clan.medals[u].logo) + '" width="32" title="' + Tools.escapeHTML(clan.medals[u].desc) + '" />&nbsp;&nbsp;';
			}
		}
		this.sendReplyBox(
			'<div id="fichaclan">' +
			'<h4><center><p> <br />' + Tools.escapeHTML(clanTitle) + '</center></h4><hr width="90%" />' +
			'<table width="90%" border="2" align="center"><tr><td width="180" rowspan="2"><div align="center"><img src="' + encodeURI(clan.logo) +
			'" width="160" height="160" /></div></td><td height="64" align="left" valign="middle"><span class="lemaclan">'+ Tools.escapeHTML(clan.lema) +
			'</span></td> </tr>  <tr>    <td align="left" valign="middle"><strong>Sala del clan</strong>: ' + salaClanSource +
			' <p style="font-style: normal;font-size: 16px;"><strong>Puntuación</strong>:&nbsp;' + clan.rating +
			' (' + clan.wins + ' Victorias, ' + clan.losses + ' Derrotas, ' + clan.draws + ' Empates)<br />' +
			' </p> <p style="font-style: normal;font-size: 16px;">&nbsp;' + medalsClan +
			'</p></td>  </tr></table></div>'
		);
	},

	setlemaclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usa: /setlemaclan clan, lema");

		if (!Clans.setLema(params[0], params[1]))
			this.sendReply("El clan no existe o el lema es mayor de 80 caracteres.");
		else {
			this.sendReply("<b>El nuevo lema del clan " + params[0] + " ha sido establecido con éxito.</b>");
		}
	},

	setlogoclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usa: /setlogoclan clan, logo");

		if (!Clans.setLogo(params[0], params[1]))
			this.sendReply("El clan no existe o el link del logo es mayor de 80 caracteres.");
		else {
			this.sendReply("<b>El nuevo logo del clan " + params[0] + " ha sido establecido con éxito.</b>");
		}
	},

	settitleclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usa: /settitleclan clan, titulo");

		if (!Clans.setCompname(params[0], params[1]))
			this.sendReply("El clan no existe o el título es mayor de 80 caracteres.");
		else {
			this.sendReply("<b>El nuevo titulo del clan " + params[0] + " ha sido establecido con éxito.</b>");
		}
	},

	setrankclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usa: /setrankclan clan, valor");

		if (!Clans.setRanking(params[0], params[1]))
			this.sendReply("El clan no existe o el valor no es válido.");
		else {
			this.sendReply("<b>El nuevo rank para el clan " + params[0] + " ha sido establecido con éxito.</b>");
		}
	},

	setgxeclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 4) return this.sendReply("Usa: /setgxeclan clan, wins, losses, ties");

		if (!Clans.setGxe(params[0], params[1], params[2], params[3]))
			this.sendReply("El clan no existe o el valor no es válido.");
		else {
			this.sendReply("<b>El nuevo GXE para el clan " + params[0] + " ha sido establecido con éxito.</b>");
		}
	},

	setsalaclan: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usa: /setsalaclan clan, sala");

		if (!Clans.setSala(params[0], params[1]))
			this.sendReply("El clan no existe o el nombre de la sala es mayor de 80 caracteres.");
		else {
			this.sendReply("<b>La nueva sala del clan " + params[0] + " ha sido creada con éxito.</b>");
		}
	},
	
	giveclanmedal: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 4) return this.sendReply("Usa: /giveclanmedal clan, medallaId, imagen, desc");

		if (!Clans.addMedal(params[0], params[1], params[2], params[3]))
			this.sendReply("El clan no existe o alguno de los datos no es correcto");
		else {
			this.sendReply("Has entregado una medalla al clan " + params[0]);
		}
	},
	
	removeclanmedal: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usa: /removeclanmedal clan, medallaId");

		if (!Clans.deleteMedal(params[0], params[1]))
			this.sendReply("El clan no existe o no podeía dicha medalla");
		else {
			this.sendReply("Has quitado una medalla al clan " + params[0]);
		}
	},

	lemaclan: function (target, room, user) {
		var permisionClan = false;
		if (!target) return this.sendReply("Debe especificar un lema.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 2) permisionClan = true;
			if (!permisionClan && !this.can('clans')) return false;
		} else {
			return false;
		}
		var claninfo = Clans.getElementalData (clanUser);
		if (room && room.id === toId(claninfo.sala)) {
			if (!Clans.setLema(clanUser, target))
				this.sendReply("El lema es mayor de 80 caracteres.");
			else {
				this.addModCommand("Un nuevo lema para el clan " + clanUser + " ha sido establecido por " + user.name);
			}
		} else {
			this.sendReply("Este comando solo puede ser usado en la sala del clan.");
		}
	},

	logoclan: function (target, room, user) {
		var permisionClan = false;
		if (!target) return this.sendReply("Debe especificar un logo.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 2) permisionClan = true;
			if (!permisionClan && !this.can('clans')) return false;
		} else {
			return false;
		}
		var claninfo = Clans.getElementalData (clanUser);
		if (room && room.id === toId(claninfo.sala)) {
			if (!Clans.setLogo(clanUser, target))
				this.sendReply("El logo es mayor de 80 caracteres.");
			else {
				this.addModCommand("Un nuevo logotipo para el clan " + clanUser + " ha sido establecido por " + user.name);
			}
		} else {
			this.sendReply("Este comando solo puede ser usado en la sala del clan.");
		}
	},

	addclanmember: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (params.length !== 2) return this.sendReply("Usa: /addclanmember clan, member");

		var user = Users.getExact(params[1]);
		if (!user || !user.connected) return this.sendReply("User: " + params[1] + " is not online.");

		if (!Clans.addMember(params[0], params[1]))
			this.sendReply("Could not add the user to the clan. Does the clan exist or is the user already in another clan?");
		else {
			this.sendReply("<b>El usuario " + user.name + " se ha añadido al clan</b>");
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join"><b>' + Tools.escapeHTML(user.name) + " se ha unido al clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</div></b>');
		}
	},

	clanleader: 'liderclan',
	liderclan: function (target, room, user) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (!params) return this.sendReply("Usa: /liderclan member");

		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("Usuario: " + params[0] + " no existe o no está disponible.");

		if (!Clans.addLeader(params[0]))
			this.sendReply("El usuario no existe, no pertenece a ningún clan o ya era líder de su clan.");
		else {
			var clanUser = Clans.findClanFromMember(params[0]);
			this.sendReply("El usuario " + userk.name + " ha nombrado como lider del clan a " + clanUser + ".");
			userk.popup(user.name + " te ha nombrado Líder del clan " + clanUser + ". Utiliza el comando /clanhelp para más información.");
		}
	},

	clanoficial: 'oficialclan',
	oficialclan: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
				return this.sendReply("Usa: /demoteclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 2 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("+Bot: " + params[0] + " no existe o no está disponible.");
		if (clanTarget) {
			var clanId = toId(clanTarget);
			var userId = toId(params[0]);
			if (Clans.authMember(clanId, userId) === 2 && !this.can('clans')) return false;
		}
		if (!Clans.addOficial(params[0]))
			this.sendReply("El usuario no existe, no pertenece a ningún clan o ya era oficial de su clan.");
		else {
			this.sendReply("" + userk.name + " fue nombrado correctamente oficial del clan " + clanTarget + ".");
			userk.popup(user.name + " te ha nombrado Oficial del clan " + clanTarget + ". Utiliza el comando /clanhelp para más información.");
		}
	},

	degradarclan: 'declanauth',
	demoteclan: 'declanauth',
	declanauth: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
			return this.sendReply("Usa: /demoteclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionValue === 2 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var userk = Users.getExact(params[0]);
		if (!clanTarget) {
			return this.sendReply("El usuario no existe o no pertenece a ningún clan.");
		} else {
			var clanId = toId(clanTarget);
			var userId = toId(params[0]);
			if (Clans.authMember(clanId, userId) === 2 && !this.can('clans')) return false;
		}
		if (!Clans.deleteLeader(params[0])) {
			if (!Clans.deleteOficial(params[0])) {
				this.sendReply("El usuario no poseía ninguna autoridad dentro del clan.");
			} else {
				if (!userk || !userk.connected) {
					this.addModCommand(params[0] + " ha bajado de rango a " + clanTarget + " por " + user.name);
				} else {
					this.addModCommand(userk.name + " ha bajado de rango a " + clanTarget + " por " + user.name);
				}
			}
		} else {
			var oficialDemote = Clans.deleteOficial(params[0]);
			if (!userk || !userk.connected) {
				this.addModCommand(params[0] + " ha bajado de rango a " + clanTarget + " por " + user.name);
			} else {
				this.addModCommand(userk.name + " ha bajado de rango a " + clanTarget + " por " + user.name);
			}
		}
	},

	invitarclan: function (target, room, user) {
		var permisionClan = false;
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var permisionValue = Clans.authMember(clanUserid, iduserwrit);
			if (permisionValue === 1) permisionClan = true;
			if (permisionValue === 2) permisionClan = true;
		}
		if (!permisionClan) return false;
		var params = target.split(',');
		if (!params) return this.sendReply("Usa: /invitarclan user");
		var userk = Users.getExact(params[0]);
		if (!userk || !userk.connected) return this.sendReply("" + params[0] + " no existe o no está disponible.");
		if (!Clans.addInvite(clanUser, params[0]))
			this.sendReply("No se pudo invitar al usuario al clan");
		else {
			clanUser = Clans.findClanFromMember(user.name);
			userk.popup(user.name + " te ha invitado a unirte al clan " + clanUser + ". Para unirte al clan escribe en el chat /aceptarclan " + clanUser);
			this.addModCommand(userk.name + " ha sido invitado a unirse al clan " + clanUser + " por " + user.name);
		}
	},
	aceptarclan: function (target, room, user) {
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser) {
			return this.sendReply("Ya perteneces a un clan. No te puedes unir a otro.");
		}
		var params = target.split(',');
		if (!params) return this.sendReply("Usa: /aceptarclan clan");
		var clanpropio = Clans.getClanName(params[0]);
		if (!clanpropio) return this.sendReply("El clan no existe o no está disponible.");

		if (!Clans.aceptInvite(params[0], user.name))
			this.sendReply("El clan no existe o no has sido invitado a este.");
		else {
			this.sendReply("Te has unido correctamente al clan" + clanpropio);
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join"><b>' + Tools.escapeHTML(user.name) + " se ha unido al clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</div></b>');
		}
	},
	inviteclear: 'borrarinvitaciones',
	borrarinvitaciones: function (target, room, user) {
		var permisionClan = false;
		var clanUser = Clans.findClanFromMember(user.name);
		if (!target) {
			if (clanUser) {
				var clanUserid = toId(clanUser);
				var iduserwrit = toId(user.name);
				var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
				if (perminsionvalue === 2) permisionClan = true;
			}
			if (!permisionClan) return false;
		} else {
			if (!this.can('clans')) return;
			clanUser = target;
		}
		if (!Clans.clearInvitations(clanUser))
			this.sendReply("El clan no existe o no está disponible.");
		else {
			this.sendReply("Lista de Invitaciones pendientes del clan " + clanUser + " borrada correctamente.");
		}
	},

	removeclanmember: function (target) {
		if (!this.can('clans')) return false;
		var params = target.split(',');
		if (params.length !== 2) return this.sendReply("Usa: /removeclanmember clan, member");

		if (!Clans.removeMember(params[0], params[1]))
			this.sendReply("No se pudo remover a ese usuario del clan");
		else {
			this.sendReply("" + params[1] + " se ha removido del clan.");
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join"><b>' + Tools.escapeHTML(params[1]) + " ha abandonado el clan: " + Tools.escapeHTML(Clans.getClanName(params[0])) + '</b></div>');
		}
	},

	expulsarclan: function (target, room, user) {
		var permisionClan = false;
		var params = target.split(',');
		if (!params) {
				return this.sendReply("Usa: /demoteclan member");
		}
		var clanUser = Clans.findClanFromMember(user.name);
		var clanTarget = Clans.findClanFromMember(params[0]);
		if (clanUser) {
			var clanUserid = toId(clanUser);
			var userb = toId(params[0]);
			var iduserwrit = toId(user.name);
			var perminsionValue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionValue === 2 && clanTarget === clanUser) permisionClan = true;
		}
		if (!permisionClan && !this.can('clans')) return;
		var currentWar = Clans.findWarFromClan(clanTarget);
		if (currentWar) {
			var currentWarParticipants = Clans.getWarParticipants(currentWar);
			if (currentWarParticipants.clanAMembers[toId(params[0])] || currentWarParticipants.clanBMembers[toId(params[0])]) return this.sendReply("No puedes expulsar del clan si el miembro estaba participando en una war.");
		}
		var userk = Users.getExact(params[0]);
		if (!clanTarget) {
			return this.sendReply("El usuario no existe o no pertenece a ningún clan.");
		} else {
			var clanId = toId(clanTarget);
			var userId = toId(params[0]);
			if (Clans.authMember(clanId, userId) === 2 && !this.can('clans')) return false;
		}
		if (!Clans.removeMember(clanTarget, params[0])) {
			this.sendReply("El usuario no pudo ser expulsado del clan.");
		} else {
			if (!userk || !userk.connected) {
				this.addModCommand(params[0] + " ha sido expulsado del clan " + clanTarget + " por " + user.name);
			} else {
				this.addModCommand(userk.name + " ha sido expulsado del clan " + clanTarget + " por " + user.name);
			}
		}
	},

	 salirdelclan: 'abandonarclan',
	 clanleave: 'abandonarclan',
	 abandonarclan: function (target, room, user) {
		var clanUser = Clans.findClanFromMember(user.name);
		if (!clanUser) {
			return this.sendReply("No perteneces a ningún clan.");
		}
		var currentWar = Clans.findWarFromClan(clanUser);
		if (currentWar) {
			var currentWarParticipants = Clans.getWarParticipants(currentWar);
			if (currentWarParticipants.clanAMembers[toId(user.name)] || currentWarParticipants.clanBMembers[toId(user.name)]) return this.sendReply("No puedes salir del clan si estabas participando en una war.");
		}
		if (!Clans.removeMember(clanUser, user.name)) {
			 this.sendReply("Error al intentar salir del clan.");
		} else {
			this.sendReply("Has salido del clan" + clanUser);
			Rooms.rooms.lobby.add('|raw|<div class="clans-user-join"><b>' + Tools.escapeHTML(user.name) + " ha abandonado el clan: " + Tools.escapeHTML(Clans.getClanName(clanUser)) + '</b></div>');
		}
	},


	//new war system
	
	pendingwars: 'wars',
	wars: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		this.sendReplyBox(Clans.getPendingWars());
	},

	viewwar: 'vw',
	warstatus: 'vw',
	vw: function (target, room, user) {
		if (!this.canBroadcast()) return false;
		if (!room.isOfficial) return this.sendReply("Este comando solo puede ser usado en salas Oficiales.");
			var currentWar = Clans.findWarFromRoom(room.id);
		if (!currentWar) return this.sendReply("No había ninguna war en curso en esta sala.");
		var currentWarData = Clans.getWarData(currentWar);
		var currentWarParticipants = Clans.getWarParticipants(currentWar);
		if (currentWarData.warRound === 0) {
			this.sendReply('|raw| <hr /><h2><font color="brown">' + ' Inscríbanse a la war en formato ' +  Clans.getWarFormatName(currentWarData.format) + ' entre los clanes ' + Clans.getClanName(currentWar) + " y " + Clans.getClanName(currentWarData.against) +  '. Para unirte escribe </font> <font color="green">/JoinWar</font> <font color="brown">.</font></h2><b><font color="blue">Jugadores por clan:</font></b> ' + currentWarData.warSize + '<br /><font color="blue"><b>FORMATO:</b></font> ' + Clans.getWarFormatName(currentWarData.format) + '<hr /><br /><font color="brown"><b>Recuerda que debes mantener tu nombre durante toda la war.</b></font>');
		} else {
			var warType = "";
			if (currentWarData.warStyle === 2) warType = " total";
			var htmlSource = '<hr /><h3><center><font color=brown><big>War ' + warType + ' entre ' + Clans.getClanName(currentWar) + " y " + Clans.getClanName(currentWarData.against) + '</big></font></center></h3><center><b>FORMATO:</b> ' + Clans.getWarFormatName(currentWarData.format) + "</center><hr /><center><small><font color=red>Red</font> = descalificado, <font color=green>Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small></center><br />";
			for (var t in currentWarParticipants.byes) {
				var userFreeBye = Users.getExact(t);
				if (!userFreeBye) {userFreeBye = t;} else {userFreeBye = userFreeBye.name;}
				htmlSource += '<center><small><font color=brown>' + userFreeBye + ' ha pasado a la siguiente ronda.</font></small></center><br />';
			}
			var clanDataA = Clans.getProfile(currentWar);
			var clanDataB = Clans.getProfile(currentWarData.against);
			var matchupsTable = '<table  align="center" border="4" cellpadding="0" cellspacing="0"><tr><td align="right"><img width="100" height="100" src="' + encodeURI(clanDataA.logo) + '" />&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="center"><table  align="center" border="4" cellpadding="0" cellspacing="0">';
			for (var i in currentWarParticipants.matchups) {
				var userk = Users.getExact(currentWarParticipants.matchups[i].from);
				if (!userk) {userk = currentWarParticipants.matchups[i].from;} else {userk = userk.name;}
				var userf = Users.getExact(currentWarParticipants.matchups[i].to);
				if (!userf) {userf = currentWarParticipants.matchups[i].to;} else {userf = userf.name;}
				switch (currentWarParticipants.matchups[i].result) {
					case 0:
					matchupsTable += '<tr><td  align="right"><big>' + userk + '</big></td><td>&nbsp;vs&nbsp;</td><td><big align="left">' + userf + "</big></td></tr>";
					break;
					case 1:
					matchupsTable += '<tr><td  align="right"><a href="/' + currentWarParticipants.matchups[i].battleLink +'" room ="' + currentWarParticipants.matchups[i].battleLink + '" class="ilink"><b><big>' + userk + '</big></b></a></td><td>&nbsp;<a href="/' + currentWarParticipants.matchups[i].battleLink + '" room ="' + currentWarParticipants.matchups[i].battleLink + '" class="ilink">vs</a>&nbsp;</td><td><a href="/' + currentWarParticipants.matchups[i].battleLink + '" room ="' + currentWarParticipants.matchups[i].battleLink + '" class="ilink"><b><big align="left">' + userf + "</big></b></a></td></tr>";
					break;
					case 2:
					matchupsTable += '<tr><td  align="right"><font color="green"><b><big>' + userk + '</big></b></font></td><td>&nbsp;vs&nbsp;</td><td><font color="red"><b><big align="left">' + userf + "</big></b></font></td></tr>";
					break;
					case 3:
					matchupsTable += '<tr><td  align="right"><font color="red"><b><big>' + userk + '</big></b></font></td><td>&nbsp;vs&nbsp;</td><td><font color="green"><b><big align="left">' + userf + "</big></b></font></td></tr>";
					break;
				}
			}
			matchupsTable += '</table></td><td>&nbsp;&nbsp;&nbsp;&nbsp;<img width="100" height="100" src="' + encodeURI(clanDataB.logo) + '" /></td></tr></table><hr />';
			htmlSource += matchupsTable;
			this.sendReply('|raw| ' + htmlSource);
		}

	},

	standardwar: 'war',
	war: function (target, room, user) {
		var permisionCreateWar = false;
		if (user.group === '+' || user.group === '%' || user.group === '@' || user.group === '&' || user.group === '~') permisionCreateWar = true;
		//if (room.auth && room.auth[user.userid]) permisionCreateWar = true;
		if (!permisionCreateWar  && !this.can('wars')) return false;
		if (!room.isOfficial) return this.sendReply("Este comando solo puede ser usado en salas Oficiales.");
		if (Clans.findWarFromRoom(room.id)) return this.sendReply("Ya había una war en curso en esta sala.");
		var params = target.split(',');
		if (params.length !== 4) return this.sendReply("Usa: /war formato, tamaño, clanA, clanB");
		if (!Clans.getWarFormatName(params[0])) return this.sendReply("El formato especificado para la war no es válido.");
		params[1] = parseInt(params[1]);
		if (params[1] < 3 || params[1] > 100) return this.sendReply("El tamaño de la war no es válido.");

		if (!Clans.createWar(params[2], params[3], room.id, params[0], params[1], 1)) {
			this.sendReply("Alguno de los clanes especificados no existía o ya estaba en war.");
		} else {
			this.logModCommand(user.name + " ha iniciado una war standard entre los clanes " + Clans.getClanName(params[2]) + " y " + Clans.getClanName(params[3]) + " en formato " + Clans.getWarFormatName(params[0]) + ".");
			Rooms.rooms[room.id].addRaw('<hr /><h2><font color="brown">' + user.name + ' ha iniciado una War en formato ' +  Clans.getWarFormatName(params[0]) + ' entre los clanes ' + Clans.getClanName(params[2]) + " y " + Clans.getClanName(params[3]) +  '. Si deseas unirte escribe </font> <font color="green">/joinwar</font> <font color="brown">.</font></h2><b><font color="blue">Jugadores por clan:</font></b> ' + params[1] + '<br /><font color="blue"><b>FORMATO:</b></font> ' + Clans.getWarFormatName(params[0]) + '<hr /><br /><font color="brown"><b>Recuerda que debes mantener tu nombre durante toda la duración de la war.</b></font>');

		}
	},

	totalwar: 'wartotal',
	wartotal: function (target, room, user) {
		var permisionCreateWar = false;
		if (user.group === '+' || user.group === '%' || user.group === '@' || user.group === '&' || user.group === '~') permisionCreateWar = true;
		if (!permisionCreateWar  && !this.can('wars')) return false;
		if (!room.isOfficial) return this.sendReply("Este comando solo puede ser usado en salas Oficiales.");
		if (Clans.findWarFromRoom(room.id)) return this.sendReply("Ya había una war en curso en esta sala.");
		var params = target.split(',');
		if (params.length !== 4) return this.sendReply("Usa: /totalwar formato, tamaño, clanA, clanB");
		if (!Clans.getWarFormatName(params[0])) return this.sendReply("El formato especificado para la war no es válido.");
		params[1] = parseInt(params[1]);
		if (params[1] < 3 || params[1] > 100) return this.sendReply("El tamaño de la war no es válido.");

		if (!Clans.createWar(params[2], params[3], room.id, params[0], params[1], 2)) {
			this.sendReply("Alguno de los clanes especificados no existía o ya estaba en war.");
		} else {
			this.logModCommand(user.name + " ha iniciado una war total entre los clanes " + Clans.getClanName(params[2]) + " y " + Clans.getClanName(params[3]) + " en formato " + Clans.getWarFormatName(params[0]) + ".");
			Rooms.rooms[room.id].addRaw('<hr /><h2><font color="brown">' + user.name + ' ha iniciado una War Total en formato ' +  Clans.getWarFormatName(params[0]) + ' entre los clanes ' + Clans.getClanName(params[2]) + " y " + Clans.getClanName(params[3]) +  '. Si deseas unirte escribe </font> <font color="green">/joinwar</font> <font color="brown">.</font></h2><b><font color="blue">Jugadores por clan:</font></b> ' + params[1] + '<br /><font color="blue"><b>FORMATO:</b></font> ' + Clans.getWarFormatName(params[0]) + '<hr /><br /><font color="brown"><b>Recuerda que debes mantener tu nombre durante toda la duración de la war.</b></font>');

		}
	},

	joinwar: 'jw',
	jw: function (target, room, user) {
		var clanUser = Clans.findClanFromMember(user.name);
		if (!clanUser) {
			return this.sendReply("No perteneces a ningún clan.");
		}
		var currentWar = Clans.findWarFromRoom(room.id);
		if (!currentWar) return this.sendReply("No había ninguna war en curso en esta sala.");
		var currentWarData = Clans.getWarData(currentWar);
		if (toId(clanUser) !== toId(currentWar) && toId(clanUser) !== toId(currentWarData.against)) return this.sendReply("No perteneces a ninguno de los clanes que se están enfrentando en war.");
		var currentWarParticipants = Clans.getWarParticipants(currentWar);
		if (currentWarParticipants.clanAMembers[toId(user.name)] || currentWarParticipants.clanBMembers[toId(user.name)]) return this.sendReply("Ya estabas inscrito en esta war.");
		if (currentWarData.warRound > 0) return this.sendReply("La War ya ha empezado. No te puedes unir.");
		var registeredA = Object.keys(currentWarParticipants.clanAMembers);
		var registeredB = Object.keys(currentWarParticipants.clanBMembers);
		if (toId(clanUser) === toId(currentWar) && registeredA.length === currentWarData.warSize) return this.sendReply("No quedan plazas para tu clan en esta war.");
		if (toId(clanUser) === toId(currentWarData.against) && registeredB.length === currentWarData.warSize) return this.sendReply("No quedan plazas para tu clan en esta war.");
		//join war
		var clanBJoin = false;
		if (toId(clanUser) === toId(currentWarData.against)) clanBJoin = true;

		if (!Clans.addWarParticipant(currentWar, user.name, clanBJoin)) {
			this.sendReply("Error al intentar unirse a la war.");
		} else {
			var freePlaces = Clans.getFreePlaces(currentWar);
			if (freePlaces > 0) {
				Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido a la War. Queda/n ' + freePlaces + ' plaza/s.');
			} else{
				Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> se ha unido a la War. Comienza la War!');
				Clans.startWar(currentWar);
				//view war status
				var warType = "";
				if (currentWarData.warStyle === 2) warType = " total";
				currentWarParticipants = Clans.getWarParticipants(currentWar);
				var htmlSource = '<hr /><h3><center><font color=brown><big>War' + warType + ' entre ' + Clans.getClanName(currentWar) + " y " + Clans.getClanName(currentWarData.against) + '</big></font></center></h3><center><b>FORMATO:</b> ' + Clans.getWarFormatName(currentWarData.format) + "</center><hr /><center><small><font color=red>Red</font> = descalificado, <font color=green>Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small><center><br />";
				var clanDataA = Clans.getProfile(currentWar);
				var clanDataB = Clans.getProfile(currentWarData.against);
				var matchupsTable = '<table  align="center" border="4" cellpadding="0" cellspacing="0"><tr><td align="right"><img width="100" height="100" src="' + encodeURI(clanDataA.logo) + '" />&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="center"><table  align="center" border="0" cellpadding="0" cellspacing="0">';
				for (var i in currentWarParticipants.matchups) {
					var userk = Users.getExact(currentWarParticipants.matchups[i].from);
					if (!userk) {userk = currentWarParticipants.matchups[i].from;} else {userk = userk.name;}
					var userf = Users.getExact(currentWarParticipants.matchups[i].to);
					if (!userf) {userf = currentWarParticipants.matchups[i].to;} else {userf = userf.name;}
					switch (currentWarParticipants.matchups[i].result) {
						case 0:
						matchupsTable += '<tr><td  align="right"><big>' + userk + '</big></td><td>&nbsp;vs&nbsp;</td><td><big align="left">' + userf + "</big></td></tr>";
						break;
						case 1:
						matchupsTable += '<tr><td  align="right"><a href="' + currentWarParticipants.matchups[i].battleLink + '" room ="' + currentWarParticipants.matchups[i].battleLink + '"class="ilink"><big>' + userk + '</big></a></td><td>&nbsp;<a href="' + currentWarParticipants.matchups[i].battleLink + '" room ="' + currentWarParticipants.matchups[i].battleLink + '"class="ilink">vs</a>&nbsp;</td><td><a href="' + currentWarParticipants.matchups[i].battleLink + '" room ="' + currentWarParticipants.matchups[i].battleLink + '"class="ilink"><big align="left">' + userf + "</big></a></td></tr>";
						break;
						case 2:
						matchupsTable += '<tr><td  align="right"><font color="green"><big>' + userk + '</big></font></td><td>&nbsp;vs&nbsp;</td><td><font color="red"><big align="left">' + userf + "</big></font></td></tr>";
						break;
						case 3:
						matchupsTable += '<tr><td  align="right"><font color="red"><big>' + userk + '</big></font></td><td>&nbsp;vs&nbsp;</td><td><font color="green"><big align="left">' + userf + "</big></font></td></tr>";
						break;
					}
				}
				matchupsTable += '</table></td><td>&nbsp;&nbsp;&nbsp;&nbsp;<img width="100" height="100" src="' + encodeURI(clanDataB.logo) + '" /></td></tr></table><hr />';
				htmlSource += matchupsTable;
				Rooms.rooms[room.id].addRaw(htmlSource);
			}
		}

	},

	leavewar: 'lw',
	lw: function (target, room, user) {
		var clanUser = Clans.findClanFromMember(user.name);
		if (!clanUser) {
			return this.sendReply("No perteneces a ningún clan.");
		}
		var currentWar = Clans.findWarFromRoom(room.id);
		if (!currentWar) return this.sendReply("No había ninguna war en curso en esta sala.");
		var currentWarData = Clans.getWarData(currentWar);
		if (toId(clanUser) !== toId(currentWar) && toId(clanUser) !== toId(currentWarData.against)) return this.sendReply("No perteneces a ninguno de los clanes que se están enfrentando en war.");
		var currentWarParticipants = Clans.getWarParticipants(currentWar);
		if (!currentWarParticipants.clanAMembers[toId(user.name)] && !currentWarParticipants.clanBMembers[toId(user.name)]) return this.sendReply("No estabas inscrito en esta war.");
		if (currentWarData.warRound > 0) return this.sendReply("La War ya ha empezado. No puedes salir de ella.");
		//leave war
		var clanBJoin = false;
		if (toId(clanUser) === toId(currentWarData.against)) clanBJoin = true;

		if (!Clans.removeWarParticipant(currentWar, user.name, clanBJoin)) {
			this.sendReply("Error al intentar salir de la war.");
		} else {
			var freePlaces = Clans.getFreePlaces(currentWar);
			Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha salido de la War. Queda/n ' + freePlaces + ' plaza/s.');
		}

	},

	warkick: function (target, room, user) {
		var permisionModWar = false;
		if (user.group === '%' || user.group === '@' || user.group === '&' || user.group === '~') permisionModWar = true;
		if (!permisionModWar  && !this.can('wars')) return false;
		if (!target) return this.sendReply("No has especificado ningún usuario");
		var clanUser = Clans.findClanFromMember(target);
		if (!clanUser) {
			return this.sendReply("El usuario no pertene a ningún clan.");
		}
		var currentWar = Clans.findWarFromRoom(room.id);
		if (!currentWar) return this.sendReply("No había ninguna war en curso en esta sala.");
		var currentWarData = Clans.getWarData(currentWar);
		if (toId(clanUser) !== toId(currentWar) && toId(clanUser) !== toId(currentWarData.against)) return this.sendReply("El usuario no pertenece a ninguno de los clanes que se están enfrentando en war.");
		var currentWarParticipants = Clans.getWarParticipants(currentWar);
		if (!currentWarParticipants.clanAMembers[toId(target)] && !currentWarParticipants.clanBMembers[toId(target)]) return this.sendReply("El Usuario no estaba inscrito en esta war.");
		if (currentWarData.warRound > 0) return this.sendReply("La War ya ha empezado. No puedes usar este comando.");
		//leave war
		var clanBJoin = false;
		if (toId(clanUser) === toId(currentWarData.against)) clanBJoin = true;

		if (!Clans.removeWarParticipant(currentWar, target, clanBJoin)) {
			this.sendReply("Error al intentar expulsar de la war.");
		} else {
			var freePlaces = Clans.getFreePlaces(currentWar);
			var userk = Users.getExact(target);
			if (!userk) {
				Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha expulsado a <b>' + userk.name + '</b> de la War. Queda/n ' + freePlaces + ' plaza/s.');
			} else {
				Rooms.rooms[room.id].addRaw('<b>' + user.name + '</b> ha expulsado a <b>' + toId(target) + '</b> de la War. Queda/n ' + freePlaces + ' plaza/s.');
			}
		}

	},

	wdq: 'wardq',
	wardq: function (target, room, user) {
		var permisionModWar = false;
		if (!target) return this.sendReply("No has especificado ningún usuario");
		var clanUser = Clans.findClanFromMember(target);
		if (user.group === '%' || user.group === '@' || user.group === '&' || user.group === '~') permisionModWar = true;
		if (!clanUser) {
			return this.sendReply("El usuario no pertene a ningún clan.");
		}
		if (Clans.authMember(clanUser, user.name) === 1 || Clans.authMember(clanUser, user.name) === 2) permisionModWar = true;
		if (!permisionModWar && !this.can('wars')) return false;
		var currentWar = Clans.findWarFromRoom(room.id);
		if (!currentWar) return this.sendReply("No había ninguna war en curso en esta sala.");
		var currentWarData = Clans.getWarData(currentWar);
		if (toId(clanUser) !== toId(currentWar) && toId(clanUser) !== toId(currentWarData.against)) return this.sendReply("El usuario no pertenece a ninguno de los clanes que se están enfrentando en war.");
		var currentWarParticipants = Clans.getWarParticipants(currentWar);
		if (!currentWarParticipants.clanAMembers[toId(target)] && !currentWarParticipants.clanBMembers[toId(target)]) return this.sendReply("El Usuario no estaba inscrito en esta war.");
		if (currentWarData.warRound === 0) return this.sendReply("La War no ha empezado aún. No puedes usar este comando.");
		var clanBJoin = false;
		if (toId(clanUser) === toId(currentWarData.against)) clanBJoin = true;
		var matchupId = toId(target);
		if (!clanBJoin) {
			if (!currentWarParticipants.matchups[toId(target)] || currentWarParticipants.matchups[toId(target)].result > 1) return this.sendReply("El usuario no participaba en la war o ya había pasado a la siguiete ronda.");
		} else {
			var isParticipant = false;
			for (var g in currentWarParticipants.matchups) {
				if (toId(currentWarParticipants.matchups[g].to) === toId(target) && currentWarParticipants.matchups[g].result < 2) {
					isParticipant = true;
					matchupId = g;
				}
			}
			if (!isParticipant) return this.sendReply("El usuario no participaba en la war o ya había pasado a la siguiete ronda.");
		}

		if (!Clans.dqWarParticipant(currentWar, matchupId, clanBJoin)) {
			this.sendReply("El usuario no participaba en la war o ya había pasado a la siguiete ronda.");
		} else {
			var userk = Users.getExact(target);
			if (!userk) {
				this.addModCommand(target + " ha sido descalificado de la war por " + user.name + ".");
			} else {
				this.addModCommand(userk.name + " ha sido descalificado de la war por " + user.name + ".");
			}
			if (Clans.isWarEnded(currentWar)) {
				Clans.autoEndWar(currentWar);
			}
		}

	},

	warinvalidate: function (target, room, user) {
		var permisionModWar = false;
		if (!target) return this.sendReply("No has especificado ningún usuario");
		var clanUser = Clans.findClanFromMember(target);
		if (user.group === '@' || user.group === '&' || user.group === '~') permisionModWar = true;
		if (!clanUser) {
			return this.sendReply("El usuario no pertene a ningún clan.");
		}
		if (!permisionModWar  && !this.can('wars')) return false;
		var currentWar = Clans.findWarFromRoom(room.id);
		if (!currentWar) return this.sendReply("No había ninguna war en curso en esta sala.");
		var currentWarData = Clans.getWarData(currentWar);
		if (toId(clanUser) !== toId(currentWar) && toId(clanUser) !== toId(currentWarData.against)) return this.sendReply("El usuario no pertenece a ninguno de los clanes que se están enfrentando en war.");
		var currentWarParticipants = Clans.getWarParticipants(currentWar);
		if (!currentWarParticipants.clanAMembers[toId(target)] && !currentWarParticipants.clanBMembers[toId(target)]) return this.sendReply("El Usuario no estaba inscrito en esta war.");
		if (currentWarData.warRound === 0) return this.sendReply("La War no ha empezado aún. No puedes usar este comando.");
		var clanBJoin = false;
		if (toId(clanUser) === toId(currentWarData.against)) clanBJoin = true;
		var matchupId = toId(target);
		if (!clanBJoin) {
			if (!currentWarParticipants.matchups[toId(target)] || currentWarParticipants.matchups[toId(target)].result === 0) return this.sendReply("El usuario no participaba o no había ningún resultado fijado para esta batalla de war.");
		} else {
			var isParticipant = false;
			for (var g in currentWarParticipants.matchups) {
				if (toId(currentWarParticipants.matchups[g].to) === toId(target) && currentWarParticipants.matchups[g].result > 0) {
					isParticipant = true;
					matchupId = g;
				}
			}
			if (!isParticipant) return this.sendReply("El usuario no participaba en la war.");
		}

		if (!Clans.invalidateWarMatchup(currentWar, matchupId)) {
			this.sendReply("El usuario no participaba o no había ningún resultado fijado para esta batalla de war.");
		} else {
			var userk = Users.getExact(currentWarParticipants.matchups[matchupId].from);
			if (!userk) {userk = currentWarParticipants.matchups[matchupId].from;} else {userk = userk.name;}
			var userf = Users.getExact(currentWarParticipants.matchups[matchupId].to);
			if (!userf) {userf = currentWarParticipants.matchups[matchupId].to;} else {userf = userf.name;}
			this.addModCommand("La batalla entre " + userk + " y " + userf + " ha sido anulada por " + user.name + ".");
		}

	},
	wreplace: 'warreplace',
	warreplace: function (target, room, user) {
		var permisionModWar = false;
		var params = target.split(',');
		if (params.length !== 2) return this.sendReply("Usa: /wreplace usuario1, usuario2");
		var clanUser = Clans.findClanFromMember(params[0]);
		if (user.group === '%' || user.group === '@' || user.group === '&' || user.group === '~') permisionModWar = true;
		if (!clanUser) {
			return this.sendReply("El usuario no pertene a ningún clan.");
		}
		if (Clans.authMember(clanUser, user.name) === 1 || Clans.authMember(clanUser, user.name) === 2) permisionModWar = true;
		if (!permisionModWar  && !this.can('wars')) return false;
		var userh = Users.getExact(params[1]);
		if (!userh || !userh.connected) return this.sendReply("Usuario: " + params[1] + " no existe o no está disponible.");
		var clanTarget = Clans.findClanFromMember(params[1]);
		if (toId(clanTarget) !== toId(clanUser)) return this.sendReply("No puedes reemplazar por alguien de distinto clan.");
		var currentWar = Clans.findWarFromRoom(room.id);
		if (!currentWar) return this.sendReply("No había ninguna war en curso en esta sala.");
		var currentWarData = Clans.getWarData(currentWar);
		if (toId(clanUser) !== toId(currentWar) && toId(clanUser) !== toId(currentWarData.against)) return this.sendReply("El usuario no pertenece a ninguno de los clanes que se están enfrentando en war.");
		var currentWarParticipants = Clans.getWarParticipants(currentWar);
		if (!currentWarParticipants.clanAMembers[toId(params[0])] && !currentWarParticipants.clanBMembers[toId(params[0])]) return this.sendReply("El Usuario no estaba inscrito en esta war.");
		if (currentWarParticipants.clanAMembers[toId(params[1])] || currentWarParticipants.clanBMembers[toId(params[1])]) return this.sendReply("No puedes reemplazar por alguien que ya participaba en la war.");
		if (currentWarData.warRound === 0) return this.sendReply("La War no ha empezado aún. No puedes usar este comando.");
		var clanBJoin = false;
		if (toId(clanUser) === toId(currentWarData.against)) clanBJoin = true;
		var matchupId = toId(params[0]);
		if (!clanBJoin) {
			if (!currentWarParticipants.matchups[toId(params[0])] || currentWarParticipants.matchups[toId(params[0])].result !== 0) return this.sendReply("El usuario no participaba o ya había empezado su batalla.");
		} else {
			var isParticipant = false;
			for (var g in currentWarParticipants.matchups) {
				if (toId(currentWarParticipants.matchups[g].to) === toId(params[0]) && currentWarParticipants.matchups[g].result === 0) {
					isParticipant = true;
					matchupId = g;
				}
			}
			if (!isParticipant) return this.sendReply("El usuario no participaba o ya había empezado su batalla.");
		}
		if (!Clans.replaceWarParticipant(currentWar, matchupId, params[1], clanBJoin)) {
			this.sendReply("El usuario no participa en esta war.");
		} else {
			var userk = Users.getExact(params[0]);
			if (!userk) {userk = params[0];} else {userk = userk.name;}
			var userf = Users.getExact(params[1]);
			if (!userf) {userf = params[1];} else {userf = userf.name;}
			this.addModCommand(user.name + ": " + userk + " ha sido reemplazado por " + userf + ".");
		}

	},

	finalizarwar: 'endwar',
	endwar: function (target, room, user) {
		var permisionCreateWar = false;
		if (user.group === '+' || user.group === '%' || user.group === '@' || user.group === '&' || user.group === '~') permisionCreateWar = true;
		//if (room.auth && room.auth[user.userid]) permisionCreateWar = true;
		if (!permisionCreateWar  && !this.can('wars')) return false;
		var currentWar = Clans.findWarFromRoom(room.id);
		if (!currentWar) return this.sendReply("No había ninguna war en curso en esta sala.");
		var currentWarData = Clans.getWarData(currentWar);
		if (!Clans.endWar(currentWar)) {
			this.sendReply("No se pudo terminar la war de esta sala debido a un error.");
		} else {
			this.logModCommand(user.name + " ha cancelado la war entre los clanes " + Clans.getClanName(currentWar) + " y " + Clans.getClanName(currentWarData.against) + ".");
			Rooms.rooms[room.id].addRaw('<hr /><h2><b><font color="brown">' + user.name + ' ha cancelado la War entre los clanes ' + Clans.getClanName(currentWar) + " y " + Clans.getClanName(currentWarData.against) + '. <br /><hr /></b>');

		}
	},
	
	warlog: function (target, room, user) {
		var autoclan = false;
		if (!target) autoclan = true;
		if (!this.canBroadcast()) return false;
		var clan = Clans.getRating(target);
		if (!clan) {
			target = Clans.findClanFromMember(target);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan && autoclan) {
			target = Clans.findClanFromMember(user.name);
			if (target)
				clan = Clans.getRating(target);
		}
		if (!clan) {
			this.sendReply("El clan especificado no existe o no está disponible.");
			return;
		}
		var f = new Date();
		var dateWar = f.getDate() + '-' + f.getMonth() + ' ' + f.getHours() + 'h';
		this.sendReply(
			"|raw| <center><big><big><b>Ultimas Wars del clan " + Tools.escapeHTML(Clans.getClanName(target)) + "</b></big></big> <br /><br />" + Clans.getWarLogTable(target) + '<br /> Fecha del servidor: ' + dateWar + '</center>'
		);
	},
	
	closeclanroom: function (target, room, user) {
		var permisionClan = false;
		var clanRoom = Clans.findClanFromRoom(room.id);
		if (!clanRoom) return this.sendReply("Esta no es una sala de Clan.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser && toId(clanRoom) === toId(clanUser)) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 2) permisionClan = true;
			
		} 
		if (!permisionClan && !this.can('clans')) return false;
		if (!Clans.closeRoom(room.id, clanRoom))
			this.sendReply("Error al intentar cerrar la sala. Es posible que ya esté cerrada.");
		else {
			this.addModCommand("Esta sala ha sido cerrada a quienes no sean miembros de " + clanRoom + " por " + user.name);
		}
	},
	
	openclanroom: function (target, room, user) {
		var permisionClan = false;
		var clanRoom = Clans.findClanFromRoom(room.id);
		if (!clanRoom) return this.sendReply("Esta no es una sala de Clan.");
		var clanUser = Clans.findClanFromMember(user.name);
		if (clanUser && toId(clanRoom) === toId(clanUser)) {
			var clanUserid = toId(clanUser);
			var iduserwrit = toId(user.name);
			var perminsionvalue = Clans.authMember(clanUserid, iduserwrit);
			if (perminsionvalue === 2) permisionClan = true;
			
		} 
		if (!permisionClan && !this.can('clans')) return false;
		if (!Clans.openRoom(room.id, clanRoom))
			this.sendReply("Error al intentar abrir la sala. Es posible que ya esté abierta.");
		else {
			this.addModCommand("Esta sala ha sido abierta a todos los usuarios por " + user.name);
		}
	},
	
	rk: 'roomkick',
	roomkick: function (target, room, user, connection) {
		if (!target) return this.sendReply("Usa: /roomkick user");
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		target = this.splitTarget(target, true);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || !targetUser) return this.sendReply("User '" + name + "' does not exist.");
		if (!this.can('ban', targetUser, room)) return false;
		if (!Rooms.rooms[room.id].users[targetUser.userid]) {
			return this.sendReply("El usuario" + this.targetUsername + " no esta en la room " + room.id + ".");
		}
		this.addModCommand("" + targetUser.name + " fue kickeado de la room " + room.id + " por " + user.name + "." + (target ? " (" + target + ")" : ""));
		this.add('|unlink|' + this.getLastIdOf(targetUser));
		targetUser.leaveRoom(room.id);
	},
	
	kickall: function (target, room, user, connection) {
		if (user.locked || user.mutedRooms[room.id]) return this.sendReply("You cannot do this while unable to talk.");
		if (!this.can('makeroom')) return false;
		var targetUser;
		for (var f in Rooms.rooms[room.id].users) {
			targetUser = Users.getExact(Rooms.rooms[room.id].users[f]);
			if (toId(targetUser.name) !== toId(user.name)) targetUser.leaveRoom(room.id);
		}
		this.addModCommand("" + user.name + " ha kickeado a todos de la room " + room.id + '.');
	},


	/*********************************************************
	 * Help commands
	 *********************************************************/

	comandos: 'help',
	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function (target, room, user) {
		target = target.toLowerCase();
		var roomType = room.auth ? room.type + 'Room' : 'global';
		var matched = false;
		if (target === 'msg' || target === 'pm' || target === 'whisper' || target === 'w') {
			matched = true;
			this.sendReply("/msg OR /whisper OR /w [username], [message] - Send a private message.");
		}
		if (target === 'r' || target === 'reply') {
			matched = true;
			this.sendReply("/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to.");
		}
		if (target === 'rating' || target === 'ranking' || target === 'rank' || target === 'ladder') {
			matched = true;
			this.sendReply("/rating - Get your own rating.");
			this.sendReply("/rating [username] - Get user's rating.");
		}
		if (target === 'nick') {
			matched = true;
			this.sendReply("/nick [new username] - Change your username.");
		}
		if (target === 'avatar') {
			matched = true;
			this.sendReply("/avatar [new avatar number] - Change your trainer sprite.");
		}
		if (target === 'whois' || target === 'alts' || target === 'ip' || target === 'rooms') {
			matched = true;
			this.sendReply("/whois - Get details on yourself: alts, group, IP address, and rooms.");
			this.sendReply("/whois [username] - Get details on a username: alts (Requires: % @ & ~), group, IP address (Requires: @ & ~), and rooms.");
		}
		if (target === 'data') {
			matched = true;
			this.sendReply("/data [pokemon/item/move/ability] - Get details on this pokemon/item/move/ability/nature.");
			this.sendReply("!data [pokemon/item/move/ability] - Show everyone these details. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'details' || target === 'dt') {
			matched = true;
			this.sendReply("/details [pokemon] - Get additional details on this pokemon/item/move/ability/nature.");
			this.sendReply("!details [pokemon] - Show everyone these details. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'analysis') {
			matched = true;
			this.sendReply("/analysis [pokemon], [generation] - Links to the Smogon University analysis for this Pokemon in the given generation.");
			this.sendReply("!analysis [pokemon], [generation] - Shows everyone this link. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'groups') {
			matched = true;
			this.sendReply("/groups - Explains what the " + Config.groups[roomType + 'ByRank'].filter(function (g) { return g.trim(); }).join(" ") + " next to people's names mean.");
			this.sendReply("!groups - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'opensource') {
			matched = true;
			this.sendReply("/opensource - Links to PS's source code repository.");
			this.sendReply("!opensource - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'avatars') {
			matched = true;
			this.sendReply("/avatars - Explains how to change avatars.");
			this.sendReply("!avatars - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'intro') {
			matched = true;
			this.sendReply("/intro - Provides an introduction to competitive pokemon.");
			this.sendReply("!intro - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'cap') {
			matched = true;
			this.sendReply("/cap - Provides an introduction to the Create-A-Pokemon project.");
			this.sendReply("!cap - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'om') {
			matched = true;
			this.sendReply("/om - Provides links to information on the Other Metagames.");
			this.sendReply("!om - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'learn' || target === 'learnset' || target === 'learnall') {
			matched = true;
			this.sendReply("/learn [pokemon], [move, move, ...] - Displays how a Pokemon can learn the given moves, if it can at all.");
			this.sendReply("!learn [pokemon], [move, move, ...] - Show everyone that information. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'calc' || target === 'calculator') {
			matched = true;
			this.sendReply("/calc - Provides a link to a damage calculator");
			this.sendReply("!calc - Shows everyone a link to a damage calculator. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'blockchallenges' || target === 'away' || target === 'idle') {
			matched = true;
			this.sendReply("/away - Blocks challenges so no one can challenge you. Deactivate it with /back.");
		}
		if (target === 'allowchallenges' || target === 'back') {
			matched = true;
			this.sendReply("/back - Unlocks challenges so you can be challenged again. Deactivate it with /away.");
		}
		if (target === 'faq') {
			matched = true;
			this.sendReply("/faq [theme] - Provides a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them.");
			this.sendReply("!faq [theme] - Shows everyone a link to the FAQ. Add deviation, doubles, randomcap, restart, or staff for a link to these questions. Add all for all of them. Requires: " + Users.getGroupsThatCan('broadcast', room).join(" "));
		}
		if (target === 'highlight') {
			matched = true;
			this.sendReply("Set up highlights:");
			this.sendReply("/highlight add, word - add a new word to the highlight list.");
			this.sendReply("/highlight list - list all words that currently highlight you.");
			this.sendReply("/highlight delete, word - delete a word from the highlight list.");
			this.sendReply("/highlight delete - clear the highlight list");
		}
		if (target === 'timestamps') {
			matched = true;
			this.sendReply("Set your timestamps preference:");
			this.sendReply("/timestamps [all|lobby|pms], [minutes|seconds|off]");
			this.sendReply("all - change all timestamps preferences, lobby - change only lobby chat preferences, pms - change only PM preferences");
			this.sendReply("off - set timestamps off, minutes - show timestamps of the form [hh:mm], seconds - show timestamps of the form [hh:mm:ss]");
		}
		if (target === 'effectiveness' || target === 'matchup' || target === 'eff' || target === 'type') {
			matched = true;
			this.sendReply("/effectiveness OR /matchup OR /eff OR /type [attack], [defender] - Provides the effectiveness of a move or type on another type or a Pokémon.");
			this.sendReply("!effectiveness OR !matchup OR !eff OR !type [attack], [defender] - Shows everyone the effectiveness of a move or type on another type or a Pokémon.");
		}
		if (target === 'dexsearch' || target === 'dsearch' || target === 'ds') {
			matched = true;
			this.sendReply("/dexsearch [type], [move], [move], ... - Searches for Pokemon that fulfill the selected criteria.");
			this.sendReply("Search categories are: type, tier, color, moves, ability, gen.");
			this.sendReply("Valid colors are: green, red, blue, white, brown, yellow, purple, pink, gray and black.");
			this.sendReply("Valid tiers are: Uber/OU/BL/UU/BL2/RU/BL3/NU/LC/CAP.");
			this.sendReply("Types must be followed by ' type', e.g., 'dragon type'.");
			this.sendReply("Parameters can be excluded through the use of '!', e.g., '!water type' excludes all water types.");
			this.sendReply("The parameter 'mega' can be added to search for Mega Evolutions only, and the parameters 'FE' or 'NFE' can be added to search fully or not-fully evolved Pokemon only.");
			this.sendReply("The order of the parameters does not matter.");
		}
		if (target === 'dice' || target === 'roll') {
			matched = true;
			this.sendReply("/dice [optional max number] - Randomly picks a number between 1 and 6, or between 1 and the number you choose.");
			this.sendReply("/dice [number of dice]d[number of sides] - Simulates rolling a number of dice, e.g., /dice 2d4 simulates rolling two 4-sided dice.");
		}
		if (target === 'pick' || target === 'pickrandom') {
			matched = true;
			this.sendReply("/pick [option], [option], ... - Randomly selects an item from a list containing 2 or more elements.");
		}
		if (target === 'join') {
			matched = true;
			this.sendReply("/join [roomname] - Attempts to join the room [roomname].");
		}
		if (target === 'ignore') {
			matched = true;
			this.sendReply("/ignore [user] - Ignores all messages from the user [user].");
			this.sendReply("Note that staff messages cannot be ignored.");
		}
		if (target === 'invite') {
			matched = true;
			this.sendReply("/invite [username], [roomname] - Invites the player [username] to join the room [roomname].");
		}

		// driver commands
		if (target === 'lock' || target === 'l') {
			matched = true;
			this.sendReply("/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: " + Users.getGroupsThatCan('lock', room).join(" "));
		}
		if (target === 'unlock') {
			matched = true;
			this.sendReply("/unlock [username] - Unlocks the user. Requires: " + Users.getGroupsThatCan('lock', room).join(" "));
		}
		if (target === 'redirect' || target === 'redir') {
			matched = true;
			this.sendReply("/redirect or /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: " + Users.getGroupsThatCan('redirect', room).join(" "));
		}
		if (target === 'modnote') {
			matched = true;
			this.sendReply("/modnote [note] - Adds a moderator note that can be read through modlog. Requires: " + Users.getGroupsThatCan('staff', room).join(" "));
		}
		if (target === 'forcerename' || target === 'fr') {
			matched = true;
			this.sendReply("/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: " + Users.getGroupsThatCan('forcerename').join(" "));
		}
		if (target === 'kickbattle ') {
			matched = true;
			this.sendReply("/kickbattle [username], [reason] - Kicks a user from a battle with reason. Requires: " + Users.getGroupsThatCan('kick').join(" "));
		}
		if (target === 'warn' || target === 'k') {
			matched = true;
			this.sendReply("/warn OR /k [username], [reason] - Warns a user showing them the Pokemon Showdown Rules and [reason] in an overlay. Requires: " + Users.getGroupsThatCan('warn', room).join(" "));
		}
		if (target === 'modlog') {
			matched = true;
			this.sendReply("/modlog [roomid|all], [n] - Roomid defaults to current room. If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15. If n is not a number, search the moderator log for 'n' on room's log [roomid]. If you set [all] as [roomid], searches for 'n' on all rooms's logs. Requires: " + Users.getGroupsThatCan('staff', room).join(" "));
		}
		if (target === 'mute' || target === 'm') {
			matched = true;
			this.sendReply("/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: " + Users.getGroupsThatCan('mute', room).join(" "));
		}
		if (target === 'hourmute' || target === 'hm') {
			matched = true;
			this.sendReply("/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: " + Users.getGroupsThatCan('mute', room).join(" "));
		}
		if (target === 'unmute' || target === 'um') {
			matched = true;
			this.sendReply("/unmute [username] - Removes mute from user. Requires: " + Users.getGroupsThatCan('mute', room).join(" "));
		}

		// mod commands
		if (target === 'roomban' || target === 'rb') {
			matched = true;
			this.sendReply("/roomban [username] - Bans the user from the room you are in. Requires: " + Users.getGroupsThatCan('ban', room).join(" "));
		}
		if (target === 'roomunban') {
			matched = true;
			this.sendReply("/roomunban [username] - Unbans the user from the room you are in. Requires: " + Users.getGroupsThatCan('ban', room).join(" "));
		}
		if (target === 'ban' || target === 'b') {
			matched = true;
			this.sendReply("/ban OR /b [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: " + Users.getGroupsThatCan('ban').join(" "));
		}
		if (target === 'unban') {
			matched = true;
			this.sendReply("/unban [username] - Unban a user. Requires: " + Users.getGroupsThatCan('ban').join(" "));
		}

		// RO commands
		if (target === 'showimage') {
			matched = true;
			this.sendReply("/showimage [url], [width], [height] - Show an image. Requires: " + Users.getGroupsThatCan('declare', room).join(" "));
		}
		if (target === 'roompromote') {
			matched = true;
			this.sendReply("/roompromote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: " + Users.getGroupsThatCan('roompromote', room).join(" "));
		}
		if (target === 'roomdemote') {
			matched = true;
			this.sendReply("/roomdemote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: " + Users.getGroupsThatCan('roompromote', room).join(" "));
		}

		// leader commands
		if (target === 'banip') {
			matched = true;
			this.sendReply("/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: " + Users.getGroupsThatCan('rangeban').join(" "));
		}
		if (target === 'unbanip') {
			matched = true;
			this.sendReply("/unbanip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: " + Users.getGroupsThatCan('rangeban').join(" "));
		}
		if (target === 'unbanall') {
			matched = true;
			this.sendReply("/unbanall - Unban all IP addresses. Requires: " + Users.getGroupsThatCan('ban').join(" "));
		}
		if (target === 'promote') {
			matched = true;
			this.sendReply("/promote [username], [group] - Promotes the user to the specified group or next ranked group. Requires: " + Users.getGroupsThatCan('promote').join(" "));
		}
		if (target === 'demote') {
			matched = true;
			this.sendReply("/demote [username], [group] - Demotes the user to the specified group or previous ranked group. Requires: " + Users.getGroupsThatCan('promote').join(" "));
		}
		if (target === 'forcetie') {
			matched = true;
			this.sendReply("/forcetie - Forces the current match to tie. Requires: " + Users.getGroupsThatCan('forcewin').join(" "));
		}
		if (target === 'declare') {
			matched = true;
			this.sendReply("/declare [message] - Anonymously announces a message. Requires: " + Users.getGroupsThatCan('declare', room).join(" "));
		}

		// admin commands
		if (target === 'chatdeclare' || target === 'cdeclare') {
			matched = true;
			this.sendReply("/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: " + Users.getGroupsThatCan('gdeclare').join(" "));
		}
		if (target === 'globaldeclare' || target === 'gdeclare') {
			matched = true;
			this.sendReply("/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: " + Users.getGroupsThatCan('gdeclare').join(" "));
		}
		if (target === 'htmlbox') {
			matched = true;
			this.sendReply("/htmlbox [message] - Displays a message, parsing HTML code contained. Requires: ~ # with global authority");
		}
		if (target === 'announce' || target === 'wall') {
			matched = true;
			this.sendReply("/announce OR /wall [message] - Makes an announcement. Requires: " + Users.getGroupsThatCan('announce', room).join(" "));
		}
		if (target === 'modchat') {
			matched = true;
			this.sendReply("/modchat [off/autoconfirmed/" +
				Config.groups[roomType + 'ByRank'].filter(function (g) { return g.trim(); }).join("/") +
				"] - Set the level of moderated chat. Requires: " +
				Users.getGroupsThatCan('modchat', room).join(" ") +
				" for off/autoconfirmed/" +
				Config.groups[roomType + 'ByRank'].slice(0, 2).filter(function (g) { return g.trim(); }).join("/") +
				" options, " +
				Users.getGroupsThatCan('modchatall', room).join(" ") +
				" for all the options");
		}
		if (target === 'hotpatch') {
			matched = true;
			this.sendReply("Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: " + Users.getGroupsThatCan('hotpatch').join(" "));
			this.sendReply("Hot-patching has greater memory requirements than restarting.");
			this.sendReply("/hotpatch chat - reload chat-commands.js");
			this.sendReply("/hotpatch battles - spawn new simulator processes");
			this.sendReply("/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and also spawn new simulator processes");
		}
		if (target === 'lockdown') {
			matched = true;
			this.sendReply("/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: " + Users.getGroupsThatCan('lockdown').join(" "));
		}
		if (target === 'kill') {
			matched = true;
			this.sendReply("/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: " + Users.getGroupsThatCan('lockdown').join(" "));
		}
		if (target === 'loadbanlist') {
			matched = true;
			this.sendReply("/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: " + Users.getGroupsThatCan('hotpatch').join(" "));
		}
		if (target === 'makechatroom') {
			matched = true;
			this.sendReply("/makechatroom [roomname] - Creates a new room named [roomname]. Requires: " + Users.getGroupsThatCan('makeroom').join(" "));
		}
		if (target === 'deregisterchatroom') {
			matched = true;
			this.sendReply("/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: " + Users.getGroupsThatCan('makeroom').join(" "));
		}
		if (target === 'roomowner') {
			matched = true;
			this.sendReply("/roomowner [username] - Appoints [username] as a room owner. Removes official status. Requires: " + Users.getGroupsThatCan('roompromote', Config.groups[roomType + 'ByRank'].slice(-1)[0]).join(" "));
		}
		if (target === 'roomdeowner') {
			matched = true;
			this.sendReply("/roomdeowner [username] - Removes [username]'s status as a room owner. Requires: " + Users.getGroupsThatCan('roompromote', Config.groups[roomType + 'ByRank'].slice(-1)[0]).join(" "));
		}
		if (target === 'privateroom') {
			matched = true;
			this.sendReply("/privateroom [on/off] - Makes or unmakes a room private. Requires: " + Users.getGroupsThatCan('privateroom', room).join(" "));
		}

		// overall
		if (target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			matched = true;
			this.sendReply("/help OR /h OR /? - Gives you help.");
		}
		if (!target) {
			this.sendReply("COMMANDS: /nick, /avatar, /rating, /whois, /msg, /reply, /ignore, /away, /back, /timestamps, /highlight");
			this.sendReply("INFORMATIONAL COMMANDS: /data, /dexsearch, /groups, /opensource, /avatars, /faq, /rules, /intro, /tiers, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. Broadcasting requires: " + Users.getGroupsThatCan('broadcast', room).join(" ") + ")");
			if (user.group !== Config.groups.default[roomType]) {
				this.sendReply("DRIVER COMMANDS: /warn, /mute, /unmute, /alts, /forcerename, /modlog, /lock, /unlock, /announce, /redirect");
				this.sendReply("MODERATOR COMMANDS: /ban, /unban, /ip");
				this.sendReply("LEADER COMMANDS: /declare, /forcetie, /forcewin, /promote, /demote, /banip, /unbanall");
			}
			this.sendReply("For an overview of room commands, use /roomhelp");
			this.sendReply("For details of a specific command, use something like: /help data");
		} else if (!matched) {
			this.sendReply("Help for the command '" + target + "' was not found. Try /help for general help");
		}
	},

};
