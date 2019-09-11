#!/usr/bin/env node

'use strict'

const mri = require('mri')

const Itstime = require('../src/index')

const args = process.argv.slice(2)
const flags = mri(args)

new Itstime(flags)
