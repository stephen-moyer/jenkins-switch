#! /usr/bin/env node

var ArgumentParser = require("argparse").ArgumentParser;
var jenkinsapi = require("jenkins-api");
var store = require("data-store")("jenkins-switch");
var prompt = require("./prompt.js");
var child_process = require("child_process");
var endOfLine = require('os').EOL;

function defaultValidCheck(value) {
  return value != null;
}

var parser = new ArgumentParser({
  version: "1.0.0",
  addHelp: true,
  description: "jenkins-switch"
});

var commands = require("./commands.js");

var subparsers = parser.addSubparsers({
  title: "Commands",
  dest: "commands"
});

commands.forEach(command => {
  var parser = subparsers.addParser(command.command);
  if (command.arguments == null)
    return;
  Object.keys(command.arguments).forEach(argName => {
    var arg = command.arguments[argName];
    parser.addArgument(arg.switches, arg.options);
  });
});

var parsedArgs = parser.parseArgs();
if (parsedArgs.commands == null) return;

var identifier = process.cwd().replace(/( )|(\\)|(\/)/g, "");

var existingSettings = store.get(identifier);
var command = commands.find(c => c.command == parsedArgs.commands);

if (command.requireInit && existingSettings == null) {
  console.log(
    "This directory is not initialized Use jenkins-switch init to initialize."
  );
  process.exit(0);
  return;
}

var gitProcess = child_process.exec("git rev-parse --abbrev-ref --symbolic-full-name @{u}");
gitProcess.stdout.on("data", data => {
  runScript(data.replace(endOfLine, "").replace("\n", ""));
});
gitProcess.stderr.on("data", data => {
  console.log("You must execute this command inside a git repository and your current branch must track a remote one.");
  process.exit(0);
});

function runScript(branch) {
  // Remove the commands field from the parsedArgs
  delete parsedArgs.commands;

  // Process the arguments
  var args = Object.keys(parsedArgs);
  processArgument(0);

  function processArgument(index) {
    if (index == args.length) {
      executeCommand();
      return;
    }
    var argName = args[index];
    var argDefinition = command.arguments[argName];
    var value = parsedArgs[argName];
    var defaultValue = argDefinition.defaultValue;
    var validFunction = argDefinition.checkValid || defaultValidCheck;

    if (!validFunction(value)) {
      var question = argDefinition.ask;
      if (defaultValue != null) question += `(${defaultValue})`;
      question += ": ";
      prompt(question).then(result => {
        if (result == null || result == "") result = defaultValue;
        parsedArgs[argName] = result;
        processArgument(index);
      });
    } else {
      processArgument(index + 1);
    }
  }

  // Execute the command script.
  function executeCommand() {
    parsedArgs.branch = branch;
    var jenkins = null;
    if (command.requireInit) {
      jenkins = jenkinsapi.init(
        `${existingSettings.scheme}://${existingSettings.username}:${existingSettings.token}@${existingSettings.server}`
      );
    }
    var script = require(`./command-${command.command}.js`);
    var result = script(
      identifier,
      store,
      parsedArgs,
      existingSettings,
      jenkins
    );
    if (typeof result == "object" && "then" in result) {
      result.then(result => {
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }
}
