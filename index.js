const program = require('commander');
const moment  = require('moment-timezone');
const Eris    = require('eris');
const request = require('request');
const fs      = require('fs');
const path    = require('path');
const db      = require('diskdb');
const util    = require('util');
const Config  = require('./src/Config');


db.connect(__dirname, ['database']);

const guilds = db.database;
const owner  = '108432868149035008';

process.on('uncaughtException', function (err) {
    console.log(err);
});


function loadFiles(bot, directory) {
    fs.readdir(path.join(__dirname, 'src', directory), (err, files) => {
        console.log(`Loading ${files.length} ${directory} files...`);
        if (err) {
            return console.error(err);
        }
        
        if (!files) {
            console.error('No command files.');
        } else {
            for (let file of files) {
                if (path.extname(file) !== '.js' || file.indexOf('Abstract') >= 0) {
                    continue;
                }
                
                let cls = require(`./src/${directory}/${file}`);
                let instance = new cls(bot);
                console.log(`Added ${directory}: ${instance.name || file}`);
                if (directory === 'Command' && instance.subCommands && instance.subCommands.length > 0) {
                    for (let subCls of instance.subCommands) {
                        let subInstance = new subCls(bot, instance.command);
                        console.log(`Added sub${directory}: ${subInstance.name}`)
                    }
                }
            }
            console.log('Finished.')
        }
    });
    
}

program
    .version('0.0.1')
    .arguments('<token> <prefix> [shards]')
    .action((token, prefix, shards) => {
        let bot = new Eris.CommandClient(token, {getAllUsers: true, maxShards: parseInt(shards, 10) || 1}, {
            description: "Anti-Raid Bot",
            owner:       `<@${owner}>`,
            prefix:      prefix
        });
        
        bot.config = new Config(prefix);
        
        Eris.Message.prototype.reply  = async function (content, file) {
            return await bot.createMessage(this.channel.id, content, file);
        };
        Eris.Message.prototype.edit   = async function (content) {
            return await bot.editMessage(this.channel.id, this.id, content);
        };
        Eris.Message.prototype.delete = async function () {
            return await this.channel.deleteMessage(this.id);
        };
        
        bot.on("ready", () => {
            console.log("Ready!");
            console.log(bot.guilds.size + " guilds registered");
            
            bot.config.getAll().then(guilds => {
                for (let guild of guilds) {
                    bot.registerGuildPrefix(guild.guildId, guild.prefix || prefix)
                }
            })
        });
        bot.on('connect', id => console.log("Shard Connected: " + id));
        //bot.on('debug', console.log);
        bot.on('warn', console.log);
        bot.on('error', console.log);
        bot.on('messageCreate', msg => {
            let builder = "";
            
            const channel = msg.channel;
            const guild   = channel.guild;
            
            builder += "\x1b[34m";
            builder += !guild ? "[Private Message]" : `[${guild.name}] [#${channel.name}]`;
            builder += "\x1b[32m";
            builder += ` <@${msg.author.id}> ${msg.author.username}:`;
            builder += "\x1b[39m";
            builder += ` ${msg.content.replace("\n", "").replace("\r", "")}`;
            
            console.log(builder);
        });
        
        loadFiles(bot, 'Subscriber');
        loadFiles(bot, 'Command');
        
        bot.connect();
    })
    .parse(process.argv);

