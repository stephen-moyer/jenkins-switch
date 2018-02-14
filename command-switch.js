var prompt = require("./prompt");
var jenkinsapi = require("jenkins-api");

module.exports = function(identifier, store, args, existingSettings, jenkins) {
  return switchBranch(identifier, store, args, existingSettings, jenkins);
};

function switchBranch(identifier, store, args, existingSettings, jenkins) {
  console.log("");

  if (existingSettings.jobs == null || existingSettings.jobs.length == 0) {
    console.log(`No jobs to switch branches for.`);
  } else {
    console.log(
      `Switching to branch ${args.branch} for jobs ${existingSettings.jobs.join(
        " & "
      )}...`
    );
  }

  console.log("");

  var jobs = existingSettings.jobs;
  var promises = [];

  for (var i = 0; i < jobs.length; i++) {
    let job = jobs[i];
    promises.push(
      new Promise(resolve => {
        jenkins.update_config(
          job,
          function(config) {
            var foundBranchSpec =
              config.indexOf("hudson.plugins.git.BranchSpec") != -1;

            if (!foundBranchSpec) {
              throw new Error(`Invalid config for job.`);
            }

            return config.replace(
              /<hudson.plugins.git.BranchSpec>[\s\S]*?<\/hudson.plugins.git.BranchSpec>/g,
              `<hudson.plugins.git.BranchSpec><name>${
                args.branch
              }</name></hudson.plugins.git.BranchSpec>`
            );
          },
          function(err, data) {
            // if no error, job was copied
            if (err) {
              console.log(`Error updating config for job ${job}.`);
              return console.log(err);
            }
            console.log(`Updated job ${job} successfully.`);

            if (!args.build) {
              resolve();
            } else {
              jenkins.build(job, {}, function(err, data) {
                if (err) {
                  console.log(`Error building job ${job}`);
                  return console.log(err);
                }
                console.log(`Built job ${job} successfully.`);
                resolve();
              });
            }
          }
        );
      })
    );
  }

  return Promise.all(promises);
}
