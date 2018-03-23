var prompt = require("./prompt");
var jenkinsapi = require('jenkins-api');

module.exports = function(identifier, store, args, existingSettings) {
    if (existingSettings) {
        return prompt("Are you sure you want to overwrite the settings already defined for this directory (yes/no)?").then(result => {
            if (result != "yes")
                return;
            return initializeDirectory(identifier, store, args);
        });
    }
    return initializeDirectory(identifier, store, args);
}

function initializeDirectory(identifier, store, args) {
    console.log("");
    console.log("Checking authentication against Jenkins...");
    console.log("");
    
    var jenkins = jenkinsapi.init(`${args.scheme}://${args.username}:${args.token}@${args.server}`);

    return new Promise(resolve => {
        //Check queued items to test token
        jenkins.queue({}, function(err, data) {
            if (err) {
                console.log("Error authenticating with jenkins.")
                console.log(err);
                resolve();
                return;
            }
            console.log("Authenticated. Directory initialized.");
            store.set(identifier, {
                scheme: args.scheme,
                username: args.username,
                token: args.token,
                server: args.server,
                jobs: {
                    "default": []
                }
            });
            resolve();
        });
    });
}