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
  const envPath = path.join(process.cwd(), '.env')
  loadEnv(envPath)

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL no está configurada en .env')
    process.exit(1)
  }

  const { neon } = require('@neondatabase/serverless')
  const sql = neon(process.env.DATABASE_URL)

  try {
    console.log('Alterando FK plano_id en lotes a ON DELETE SET NULL...')
    // Drop the default fk constraint if it exists (common name)
    await sql`ALTER TABLE lotes DROP CONSTRAINT IF EXISTS lotes_plano_id_fkey`
    // Add new FK constraint with ON DELETE SET NULL (use a known name)
    await sql`ALTER TABLE lotes ADD CONSTRAINT lotes_plano_id_fkey FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE SET NULL`
    console.log('Alteración aplicada correctamente.')
    process.exit(0)
  } catch (err) {
    console.error('Error alterando constraint:', err)
    process.exit(2)
  }
}

main()
