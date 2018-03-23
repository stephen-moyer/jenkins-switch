var prompt = require("./prompt");
var jenkinsapi = require("jenkins-api");

module.exports = function(identifier, store, args, existingSettings, jenkins) {
  return addJob(identifier, store, args, existingSettings, jenkins);
};

function addJob(identifier, store, args, existingSettings, jenkins) {
  console.log("");
  console.log(`Jobs in configuration ${args.config}:`);

  var jobs = (existingSettings.jobs = existingSettings.jobs || {});

  // Older version when we didn't support configurations
  if (Array.isArray(jobs)) {
    jobs = existingSettings.jobs = {
      default: jobs
    };
  }

  if (!(args.config in jobs)) 
    jobs[args.config] = [];

  var configurationJobs = jobs[args.config];

  configurationJobs.forEach(job => console.log(` -${job}`))

  console.log("");  
}
