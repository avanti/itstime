#!/usr/bin/env node

const fs = require('fs')
const inquirer = require('inquirer')
const beautify = require('json-beautify')

const config = require('../config/')

class Setup {
  constructor() {
    this.questions = [
      {
        name: 'ahgora_id',
        message: 'Ahgora - Company id:',
        default: 'a284843'
      },
      {
        name: 'ahgora_userId',
        message: 'Ahgora - User id:'
      },
      {
        name: 'ahgora_password',
        message: 'Ahgora - password:',
        type: 'password'
      },
      {
        name: 'jobber_userId',
        message: 'Jobber - User id:'
      },
      {
        name: 'jobber_token',
        message: 'Jobber - Token:'
      },
      {
        name: 'toggl_token',
        message: 'Toggl - Token:'
      },
      {
        name: 'toggl_workspaceId',
        message: 'Toggl - Workspace id:'
      }
    ]

    this.ask()
  }

  async ask() {
    this.answers = await this.getAnswers()

    try {
      await this.createFile()
      process.exit(1)
    } catch (err) {
      console.log(err)
    }
  }

  getAnswers() {
    return new Promise(resolve => {
      const answers = inquirer.prompt(this.questions)

      resolve(answers)
    })
  }

  createFile() {
    return new Promise((resolve, reject) => {
      const content = beautify(this.answers, null, 2, 100)

      fs.writeFile(config.dotFile, content, err => {
        if (err) {
          reject(err)
        }

        resolve(config.dotFile)
      })
    })
  }
}

module.exports = Setup
