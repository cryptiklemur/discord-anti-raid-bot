const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Long   = mongoose.Types.Long;
const Schema = mongoose.Schema;

const schema = new Schema({
    guildId:     Long,
    userId:      Long,
    handled:     {type: Boolean, default: true},
    whitelisted: {type: Boolean, default: false},
    method:      {type: String, enum: ['kick', 'notify', 'ban']},
    insertDate:  {type: Date, default: Date.now},
    handleDate:  {type: Date, default: Date.now}
});
schema.index({guildId: 1});
schema.index({guildId: 1, userId: 1});
schema.index({userId: 1});
schema.index({insertDate: 1});
schema.index({handleDate: 1});

module.exports = mongoose.model('Join', schema);
