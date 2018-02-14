var prompt = require("./prompt");
var jenkinsapi = require("jenkins-api");

module.exports = function(identifier, store, args, existingSettings, jenkins) {
  return addJob(identifier, store, args, existingSettings, jenkins);
};

function addJob(identifier, store, args, existingSettings, jenkins) {
  console.log("");
  console.log(`Adding job ${args.name}...`);
  console.log("");

  var jobs = (existingSettings.jobs = existingSettings.jobs || []);

  if (jobs.find(j => j == args.name)) {
    console.log(`Job ${args.name} already exists.`);
    return;
  }

  return new Promise(resolve => {
        jenkins.get_config_xml(args.name, { depth: 1 }, function(err, data) {
            if (err) {
                console.log("Error adding job.")
                console.log(err);
                return;
            }
            var foundBranchSpec = data.indexOf("hudson.plugins.git.BranchSpec") != -1;
            if (!foundBranchSpec) {
                console.log("Invalid job(could not find a branchspec).");
                return;
            }
            jobs.push(args.name);
            store.set(identifier, existingSettings);
            console.log(`Added job ${args.name} successfully.`);
        });
    });
}
