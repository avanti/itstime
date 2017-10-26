class Help {
  constructor() {
    this.start()
  }

  start() {
    /* eslint-disable no-multi-spaces */
    const help =  '\nUsage:\n' +
                  '  \x1b[36mitstime\x1b[0m <command> [<args>]\n\n' +

                  'Commands:\n' +
                  '  help            Display help information about Itstime\n' +
                  '  refresh         Change setup option\n' +
                  '  setup           Setup options\n' +
                  '  status          Return a preview up\n' +
                  '  up              Register hours in Jobber\n'
    /* eslint-disable no-multi-spaces */

    console.log(help)
  }
}

module.exports = Help
