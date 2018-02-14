module.exports = [
    {
        command: "init",
        requireInit: false,
        arguments: {
            server: {
                switches: [ "-s", "--server" ],
                options: {
                    // This is if you want to fill it in without asking
                    defaultValue: null,
                    help: "The server address to login to (no http or https)."
                },
                ask: "Enter the server address (no http or https)"
            },
            username: {
                switches: [ "-u", "--username" ],
                options: {
                    defaultValue: null,
                    help: "The username to use for login."
                },
                ask: "Enter the username"
            },
            token: {
                switches: [ "-t", "--token" ],
                options: {
                    defaultValue: null,
                    help: "The token to use for login."
                },
                ask: "Enter the token"
            },
            scheme: {
                switches: [ "--scheme" ],
                options: {
                    defaultValue: "http",
                    help: "http or https."
                }
            }
        }
    },
    {
        command: "add-job",
        requireInit: true,
        arguments: {
            name: {
                switches: [ "-n", "--name" ],
                options: {
                    defaultValue: null,
                    help: "The job name"
                },
                ask: "Enter the job name"
            }
        }
    },
    {
        command: "remove-job",
        requireInit: true,
        arguments: {
            name: {
                switches: [ "-n", "--name" ],
                options: {
                    defaultValue: null,
                    help: "The job name"
                },
                ask: "Enter the job name"
            }
        }
    },
    {
        command: "switch",
        requireInit: true,
        arguments: {
            build: {
                switches: [ "-b", "--build" ],
                options: {
                    nargs: 0,
                    constant: true,
                    defaultValue: false,
                    help: "Build the job?"
                }
            }
        }
    }
]