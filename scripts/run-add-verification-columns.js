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
    // remove optional surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    process.env[key] = val
  })
}

async function main() {
  const envPath = path.join(process.cwd(), '.env')
  loadEnv(envPath)

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL no está configurada en .env')
    process.exit(1)
  }

  const { neon } = require('@neondatabase/serverless')
  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log('Ejecutando migración: agregando columnas de verificación en usuarios...')
    await sql`
      ALTER TABLE usuarios
        ADD COLUMN IF NOT EXISTS token_verificacion VARCHAR(255),
        ADD COLUMN IF NOT EXISTS token_verificacion_expira TIMESTAMP;
    `
    console.log('Migración aplicada correctamente.')
    process.exit(0)
  } catch (err) {
    console.error('Error aplicando migración:', err)
    process.exit(2)
  }
}

main()
