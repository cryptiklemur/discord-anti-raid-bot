const moment = require('moment-timezone');

function ParseDuration(input) {
    const days    = "(d(ays?)?)";
    const hours   = "(h((ours?)|(rs?))?)";
    const minutes = "(m((inutes?)|(ins?))?)";
    const seconds = "(s((econds?)|(ecs?))?)";
    
    const regex = new RegExp(
        `\\s*(\\d+)\\s*((${days}|${hours}|${minutes}|${seconds}|\\Z))`,
        "ig"
    );
    let m;
    
    let duration = moment.duration(0);
    let matches  = 0;
    while (true) {
        m = regex.exec(input);
        if (m === null) {
            break;
        }
        matches++;
        
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        if (new RegExp("\A" + days).test(m[2])) {
            duration.add(parseInt(m[1], 10), "d");
        } else if (new RegExp(hours).test(m[2])) {
            duration.add(parseInt(m[1], 10), "h");
        } else if (new RegExp(minutes).test(m[2])) {
            duration.add(parseInt(m[1], 10), "m");
        } else if (new RegExp(seconds).test(m[2])) {
            duration.add(parseInt(m[1], 10), "s");
        } else {
            throw new Error("Failed to parse duration");
        }
    }
    
    if (matches === 0) {
        throw new Error("Failed to parse duration");
    }
    
    return duration;
}

module.exports = {
    ParseDuration
};
