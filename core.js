/**
 * Core
 * Created by CreaturePhil - https://github.com/CreaturePhil
 *
 * This is where essential core infrastructure of
 * Pokemon Showdown extensions for private servers.
 * Core contains standard streams, profile infrastructure,
 * elo rating calculations, and polls infrastructure.
 *
 * @license MIT license
 */

var fs = require("fs");
var path = require("path");

var core = exports.core = {

    stdin: function (file, name) {
        var data = fs.readFileSync('config/' + file + '.csv', 'utf8').split('\n');

        var len = data.length;
        while (len--) {
            if (!data[len]) continue;
            var parts = data[len].split(',');
            if (parts[0].toLowerCase() === name) {
                return parts[1];
            }
        }
        return 0;
    },

    stdout: function (file, name, info, callback) {
        var data = fs.readFileSync('config/' + file + '.csv', 'utf8').split('\n');
        var match = false;

        var len = data.length;
        while (len--) {
            if (!data[len]) continue;
            var parts = data[len].split(',');
            if (parts[0] === name) {
                data = data[len];
                match = true;
                break;
            }
        }

        if (match === true) {
            var re = new RegExp(data, 'g');
            fs.readFile('config/' + file + '.csv', 'utf8', function (err, data) {
                if (err) return console.log(err);

                var result = data.replace(re, name + ',' + info);
                fs.writeFile('config/' + file + '.csv', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                    typeof callback === 'function' && callback();
                });
            });
        } else {
            var log = fs.createWriteStream('config/' + file + '.csv', {
                'flags': 'a'
            });
            log.write('\n' + name + ',' + info);
            typeof callback === 'function' && callback();
        }
    },

    atm: {

        name: function (online, user) {
            if (online === true) {
                return '<strong>' + user.name + '</strong>';
            }
            return '<strong>' + user + '</strong>';
        },


        money: function (user) {
            return Core.stdin('money', user);
        },

        display: function (args, info, option) {
            if (args === 'money') return '&nbsp;tiene ' + info + '&nbsp;PokeDolares.';
        },

    },

    shop: function (showDisplay) {
        var shop = [
            ['Simbolo', 'Un simbolo personalizado junto a tu nick.', 35],
            ['Declare', 'Puedes hacer un declare en el server', 50],
	    ['Cambio', 'Compras la capacidad de cambiar tu avatar personalizado o tarjeta de entrenador.', 200],
            ['Avatar', 'Un avatar personalizado.', 400],
            ['Chatroom', 'Una sala de chat.', 700]
        ];

        if (showDisplay === false) {
            return shop;
        }

		var shopName = '<center><img src="http://i.imgur.com/xA7ruKZ.png" /><div class="shop">';
		
		var s = shopName;
        s += '<table border="0" cellspacing="0" cellpadding="5" width="100%"><tbody><tr><th>Nombre</th><th>Descripción</th><th>Precio</th></tr>';
        var start = 0;
        while (start < shop.length) {
            s = s + '<tr><td><button name="send" value="/buy ' + shop[start][0] + '">' + shop[start][0] + '</button></td><td>' + shop[start][1] + '</td><td>' + shop[start][2] + '</td></tr>';
            start++;
        }
        s += '</tbody></table><br /><center>Para comprar un producto de la tienda, usa el comando /buy [nombre].</center><br /></div><img src="http://i.imgur.com/fyLaZTn.png" /></center>';
        return s;
    },
    
    rank: function (user) {
            var data = fs.readFileSync('config/tourWins.csv', 'utf-8');
            var row = ('' + data).split("\n");

            var list = [];

            for (var i = row.length; i > -1; i--) {
                if (!row[i]) continue;
                var parts = row[i].split(",");
                list.push([toId(parts[0]), Number(parts[1])]);
            }

            list.sort(function (a, b) {
                return a[1] - b[1];
            });
            var arr = list.filter(function (el) {
                return !!~el.indexOf(user);
            });

            if (list.indexOf(arr[0]) === -1) {
			return '<b>Sem rank</b>';
			} else {
			return '<b>Rank ' + (list.length-list.indexOf(arr[0])) + ' de ' + list.length + '</b>';
			}
    },
		
    ladder: function (limit) {
        var data = fs.readFileSync('config/tourWins.csv', 'utf-8');
        var row = ('' + data).split("\n");

        var list = [];

        for (var i = row.length; i > -1; i--) {
            if (!row[i]) continue;
            var parts = row[i].split(",");
            list.push([toId(parts[0]), Number(parts[1])]);
        }

        list.sort(function (a, b) {
            return a[1] - b[1];
        });

        if (list.length > 1) {
            var ladder = '<table border="0" cellspacing="0" cellpadding="3"><tbody><tr><td colspan=3><hr></td></tr><th>Rank |</th><th>Usuário</th><th>| Torneios Vencidos</th><tr><td colspan=3><hr></td></tr>';
            var len = list.length;

            limit = (len - limit) - 12;
            if (limit > len) limit = len;

            while (len--) {
                if(len === limit) break;
                ladder = ladder + '<tr id="tourladder"><td><b>' + (list.length - len) + '</td><td>' + list[len][0] + '</td><td><center>' + Math.floor(list[len][1]);
            }
            ladder += '</tbody></table>';
            return ladder;
        }
        return 0;
    },
};
