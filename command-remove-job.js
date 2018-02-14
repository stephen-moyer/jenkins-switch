var prompt = require("./prompt");
var jenkinsapi = require("jenkins-api");

module.exports = function(identifier, store, args, existingSettings, jenkins) {
  return addJob(identifier, store, args, existingSettings, jenkins);
};

function addJob(identifier, store, args, existingSettings, jenkins) {
  console.log("");
  console.log(`Removing job ${args.name}...`);
  console.log("");

  var jobs = (existingSettings.jobs = existingSettings.jobs || []);
  var index = jobs.findIndex(j => j == args.name);
  if (index == -1) {
    console.log(`Job ${args.name} does not exist.`);
    return;
  }

  jobs.splice(index, 1);
  store.set(identifier, existingSettings);

  console.log(`Removed job ${args.name} successfully.`);
}
