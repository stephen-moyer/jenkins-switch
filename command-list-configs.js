var prompt = require("./prompt");
var jenkinsapi = require("jenkins-api");

module.exports = function(identifier, store, args, existingSettings, jenkins) {
  return addJob(identifier, store, args, existingSettings, jenkins);
};

function addJob(identifier, store, args, existingSettings, jenkins) {
  console.log("");
  console.log(`Configurations:`);

  var jobs = (existingSettings.jobs = existingSettings.jobs || {});

  // Older version when we didn't support configurations
  if (Array.isArray(jobs)) {
    jobs = existingSettings.jobs = {
      default: jobs
    };
  }

  for(var config in jobs) {
    if (jobs[config] == null || jobs[config].length == 0)
      continue;
      console.log(` -${config}`)
  }

  console.log("");  
}
