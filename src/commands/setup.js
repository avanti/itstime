#!/usr/bin/env node

const fs = require("fs");
const inquirer = require("inquirer");
const beautify = require("json-beautify");

const config = require("../config/");

class Setup {
  constructor(args) {
    this.questions = [
      {
        name: "App",
        message: "Tático - Hash:",
        default: "7DE19B1B-BAB5-4D46-A861-729AA8DFFB19"
      },
      {
        name: "cn",
        message: "Tático - Account:",
        default: "avanti2740"
      },
      {
        name: "Hash",
        message: "Tático - Hash:"
      },
      {
        name: "IDUsr",
        message: "Tático - User id:"
      },
      {
        name: "Usr",
        message: "Tático - User hash:"
      },
      {
        name: "toggl_token",
        message: "Toggl - Token:"
      },
      {
        name: "toggl_workspaceId",
        message: "Toggl - Workspace id:"
      }
    ];

    if (args.help === true) {
      this.help();
    } else {
      this.start();
    }
  }

  start() {
    this.ask();
  }

  async ask() {
    this.answers = await this.getAnswers();

    try {
      await this.createFile();
      process.exit(1);
    } catch (err) {
      console.log(err);
    }
  }

  getAnswers() {
    return new Promise(resolve => {
      const answers = inquirer.prompt(this.questions);

      resolve(answers);
    });
  }

  createFile() {
    return new Promise((resolve, reject) => {
      const content = beautify(this.answers, null, 2, 100);

      fs.writeFile(config.dotFile, content, err => {
        if (err) {
          reject(err);
        }

        resolve(config.dotFile);
      });
    });
  }

  help() {
    /* eslint-disable no-multi-spaces */
    const help = "\nUsage:\n" + "  \x1b[36mitstime\x1b[0m setup\n";
    /* eslint-disable no-multi-spaces */

    console.log(help);
  }
}

module.exports = Setup;
