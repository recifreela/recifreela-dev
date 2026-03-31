import fs from 'node:fs'
import path from 'node:path'

import dotenv from 'dotenv'

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return false
  dotenv.config({ path: filePath })
  return true
}

export function loadEnv() {
  const candidates = [
    path.join(process.cwd(), 'apps', 'api', '.env'),
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '..', '.env')
  ]

  for (const candidate of candidates) {
    if (loadEnvFile(candidate)) return
  }
}

