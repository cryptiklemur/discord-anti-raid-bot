const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const cache = {};

const schema = new Schema({
    guildId:   String,
    prefix:    String,
    enabled:   {type: Boolean},
    age:       String,
    method:    {type: String, enum: ['kick', 'notify', 'ban']},
    message:   String,
    webhook:   String,
    whitelist: [String],
    invite:    String,
});
schema.index({guildId: 1});
schema.index({enabled: 1});
schema.post('save', doc => delete cache[doc.guildId]);

const ConfigModel = mongoose.model('Config', schema);

class Config {
    constructor(prefix) {
        this.defaultPrefix = prefix;
        mongoose.Promise   = global.Promise;
        mongoose.connect(process.env.MONGO_URL);
    }
    
    async get(guild) {
        return new Promise((resolve, reject) => {
            if (cache[guild.id]) {
                return resolve(cache[guild.id]);
            }
            
            ConfigModel.findOne({guildId: guild.id}, (err, doc) => {
                if (err) {
                    return reject(err);
                }
                
                if (!doc) {
                    doc = new ConfigModel({
                        guildId: guild.id,
                        prefix:  this.defaultPrefix,
                        enabled: false,
                        age:     '24h',
                        method:  'kick',
                        message: 'Sorry, this server is currently under anti-raid mode.'
                    });
                    
                    return doc.save((err, updatedDoc) => {
                        cache[guild.id] = updatedDoc;
                        
                        resolve(updatedDoc);
                    });
                }
                
                cache[guild.id] = doc;
                
                resolve(doc);
            });
        });
    }
    
    async getAll() {
        return new Promise((resolve, reject) => {
            ConfigModel.find((err, docs) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(docs);
            });
        });
    }
}

module.exports = Config;