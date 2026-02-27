-- Agrega campos numéricos a planos y referencia plano en lotes
BEGIN;

ALTER TABLE IF EXISTS planos
  ADD COLUMN IF NOT EXISTS cuartos INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS banos INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS parqueaderos INTEGER NOT NULL DEFAULT 0;

-- Añade referencia a plano en lotes (nullable para no romper datos existentes)
ALTER TABLE IF EXISTS lotes
  ADD COLUMN IF NOT EXISTS plano_id INTEGER NULL REFERENCES planos(id);

COMMIT;
