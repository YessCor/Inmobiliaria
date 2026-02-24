-- Agrega columna 'tipo' a la tabla pagos
ALTER TABLE pagos
  ADD COLUMN IF NOT EXISTS tipo VARCHAR(32) DEFAULT 'cuota_normal';
