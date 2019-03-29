#!/usr/bin/env node
const isProduciton = process.env.NODE_ENV === 'production'

if (!isProduciton) {
  require('./dev')
}
else {
  require('./prod')
}