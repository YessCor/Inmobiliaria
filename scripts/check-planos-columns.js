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

  const { neon } = require('@neondatabase/serverless')
  const sql = neon(process.env.DATABASE_URL)

  try {
    const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'planos' ORDER BY ordinal_position`
    console.log('Columnas en table planos:')
    cols.forEach(c => console.log(`- ${c.column_name} (${c.data_type})`))
    process.exit(0)
  } catch (err) {
    console.error('Error consultando columnas:', err)
    process.exit(2)
  }
}

main()
