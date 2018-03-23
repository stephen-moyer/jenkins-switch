# jenkins-switch
Switches jenkins builds to the current branch your git repo is on.

# Getting started

1. Install `npm install -g jenkins-switch`

1. Initialize with `jenkins-switch init` in the git repository you want to switch branches for. You will need your jenkins token.

1. Add jobs with `jenkins-switch add-job -n "JobName"`. You can remove with `jenkins-switch remove-job -n "JobName"`

1. Run `jenkins-switch switch` to switch the jobs to the branch you're on. You can pass `-b` to also trigger a build.

You can list the jobs you have saved with `jenkins-switch list-jobs`

# Configurations

The add/remove/switch/list commands support configurations. This is useful if you've got multiple jobs setup in Jenkins but only want to switch some of them depending on your scenario(e.g alpha/beta jobs).

Just use the `-c` or `--config` flag in those commands to specify which configuration you're using. The default configuration is `default` if you don't pass one in.

You can view configurations with `jenkins-switch list-configs`. If you want to delete an entire configuration you can use `jenkins-switch delete-config -c CONFIG`
