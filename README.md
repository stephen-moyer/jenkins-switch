# jenkins-switch
Switches jenkins builds to the current branch your git repo is on.

# Getting started

1. Install `npm install -g jenkins-switch`

1. Initialize with `jenkins-switch init` in the git repository you want to switch branches for. You will need your jenkins token.

1. Add jobs with `jenkins-switch add-job -n "JobName"`. You can remove with `jenkins-switch remove-job -n "JobName"`

1. Run `jenkins-switch switch` to switch the jobs to the branch you're on. You can pass `-b` to also trigger a build.