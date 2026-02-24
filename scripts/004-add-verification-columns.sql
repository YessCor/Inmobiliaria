-- Agrega columnas para token de verificacion en usuarios
ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS token_verificacion VARCHAR(255),
  ADD COLUMN IF NOT EXISTS token_verificacion_expira TIMESTAMP;
