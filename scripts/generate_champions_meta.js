const fs = require('fs')
const path = require('path')

const input = path.resolve(__dirname, '../client/public/data/champions.json')
const output = path.resolve(__dirname, '../client/public/data/champions_meta.json')

const data = JSON.parse(fs.readFileSync(input, 'utf8'))

const regionList = ['Shurima','Freljord','Noxus','Demacia','Ionia','Piltover','Zaun','Bilgewater','Bandle','Targon','Ixtal','Runeterra','Ixtal','Kinkou','Shuriman','Shuriman Desert']
const speciesKeywords = {
  'Vastaya': ['vastaya','vastaya'],
  'Yordle': ['yordle','yordles','yordles'],
  'Minotaur': ['minotaure','minotaur','minotaur'],
  'Undead': ['momie','mummy','undead','mort'],
  'Phoenix': ['phénix','phoenix','cryophénix'],
  'Human': ['human','humain','fille','garçon','homme','femme'],
  'Demacian': ['demacia'],
  'Darkin': ['darkin'],
  'Voidborn': ['néant','void','néant'],
  'Yasuo': ['yordle']
}

function findSpecies(text){
  if(!text) return null
  const t = text.toLowerCase()
  for(const [name, keys] of Object.entries(speciesKeywords)){
    for(const k of keys){
      if(t.includes(k)) return name
    }
  }
  return null
}

function findRegion(text){
  if(!text) return null
  const t = text.toLowerCase()
  for(const r of regionList){
    if(t.includes(r.toLowerCase())) return r
  }
  return null
}

const meta = data.map(ch => {
  const id = ch.id || ch.name || ch.key
  const blurb = ch.blurb || ''
  const title = ch.title || ''

  // genre/gender: very hard to infer; put blank
  let genre = 'blank'

  // species: try heuristics on blurb/title
  let species = findSpecies(blurb) || findSpecies(title) || 'blank'

  // role: use tags array (join if multiple)
  const role = (ch.tags && ch.tags.length) ? ch.tags.join(', ') : 'blank'

  // resource
  const resource = ch.partype || 'blank'

  // range type
  const attackrange = ch.stats && typeof ch.stats.attackrange !== 'undefined' ? Number(ch.stats.attackrange) : null
  const range_type = (attackrange !== null) ? (attackrange < 300 ? 'mêlée' : 'à distance') : 'blank'

  // region
  const region = findRegion(blurb) || findRegion(title) || 'blank'

  // release year: unknown -> blank
  const release_year = 'blank'

  return {
    id,
    name: ch.name || id,
    genre,
    species,
    role,
    resource,
    range_type,
    region,
    release_year
  }
})

fs.writeFileSync(output, JSON.stringify(meta, null, 2), 'utf8')
console.log('Wrote', output)
