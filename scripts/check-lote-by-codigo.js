const fs = require('fs')
const path = require('path')

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  content.split(/\r?\n/).forEach(line => {
    line = line.trim()
    if (!line || line.startsWith('#')) return
    const idx = line.indexOf('=')
    if (idx === -1) return
    const key = line.slice(0, idx)
    let val = line.slice(idx + 1)
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    process.env[key] = val
  })
}

async function main() {
  loadEnv(path.join(process.cwd(), '.env'))
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL no está configurada en .env')
    process.exit(1)
  }

  const codigo = process.argv[2]
  if (!codigo) {
    console.error('Uso: node check-lote-by-codigo.js <CODIGO>')
    process.exit(1)
  }

  const { neon } = require('@neondatabase/serverless')
  const sql = neon(process.env.DATABASE_URL)

  try {
    const rows = await sql`SELECT id, codigo, area_m2, valor, estado, ubicacion FROM lotes WHERE codigo = ${codigo}`
    if (rows.length === 0) {
      console.log(`No existe un lote con codigo ${codigo}`)
      process.exit(0)
    }
    console.log(`Encontrado(s) ${rows.length} lote(s) con codigo ${codigo}:`)
    rows.forEach(r => console.log(JSON.stringify(r)))
    process.exit(0)
  } catch (err) {
    console.error('Error consultando lotes:', err)
    process.exit(2)
  }
}

main()
