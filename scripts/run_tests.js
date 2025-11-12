#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const metaPath = path.resolve(__dirname, '../client/public/data/champions_meta.json')

function fail(msg){
  console.error('FAIL:', msg)
  process.exitCode = 1
}

function pass(msg){
  console.log('PASS:', msg)
}

if(!fs.existsSync(metaPath)){
  fail(`Meta file not found at ${metaPath}`)
  process.exit(1)
}

const raw = fs.readFileSync(metaPath,'utf8')
let data
try{ data = JSON.parse(raw) }catch(e){ fail('Invalid JSON in champions_meta.json'); process.exit(1) }

if(!Array.isArray(data)){
  fail('champions_meta.json should be an array')
  process.exit(1)
}

const required = ['id','name','genre','species','role','resource','range_type','region','release_year']
let missingCount = 0
let blankCount = 0

data.forEach((c, idx)=>{
  required.forEach(k=>{
    if(!(k in c)){
      console.error(`Entry[${idx}] (${c.id||c.name||'unknown'}) missing key: ${k}`)
      missingCount++
    } else if(c[k] === 'blank' || c[k] === '' || c[k] === null || typeof c[k] === 'undefined'){
      blankCount++
    }
  })
})

console.log(`Entries checked: ${data.length}`)
console.log(`Missing keys: ${missingCount}`)
console.log(`Blank fields (placeholders): ${blankCount}`)

if(missingCount > 0){
  fail('Some entries are missing required keys')
} else {
  pass('All entries have required keys')
}

// Exit non-zero if critical failures
if(missingCount > 0) process.exit(1)
process.exit(0)
