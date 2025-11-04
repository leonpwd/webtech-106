#!/usr/bin/env node
// Fetch latest ddragon version and update ./data/champions.json
import https from 'https';
import { promises as fs } from 'fs';
import path from 'path';

(async function(){
  const get = (url) => new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });

  try {
    console.log('Fetching DDragon versions...');
    const versionsRaw = await get('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = JSON.parse(versionsRaw);
    if (!Array.isArray(versions) || versions.length === 0) throw new Error('No versions received');
    const latest = versions[0];
    console.log('Latest version:', latest);

    const champUrl = `https://ddragon.leagueoflegends.com/cdn/${latest}/data/fr_FR/champion.json`;
    console.log('Fetching champions from', champUrl);
    const championsRaw = await get(champUrl);
    const championsJson = JSON.parse(championsRaw);
    const arr = Object.values(championsJson.data || {});

    const dataDir = path.resolve('./data');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(path.join(dataDir, 'champions.json'), JSON.stringify(arr, null, 2), 'utf8');
    console.log(`Wrote ${dataDir}/champions.json (${arr.length} champions)`);

    const publicDir = path.resolve('./public/data');
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(path.join(publicDir, 'champions.json'), JSON.stringify(arr, null, 2), 'utf8');
    console.log(`Wrote ${publicDir}/champions.json (${arr.length} champions)`);
  } catch (err) {
    console.error('Failed to update champions:', err);
    process.exit(1);
  }
})();
