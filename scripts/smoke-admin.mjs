import { chromium } from 'playwright'

const base = 'http://127.0.0.1:5173'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  await page.goto(base)
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  // Avatars visible
  await page.getByRole('img', { name: /Avatar de Isabella/i }).waitFor()
  await page.getByRole('img', { name: /Avatar de Sophia/i }).waitFor()
  await page.getByRole('img', { name: /Avatar de Valentina/i }).waitFor()
  await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/avatars_profiles.png', fullPage: true })

  // Admin login
  await page.getByRole('button', { name: /Acceso Administrador/i }).click()
  await page.waitForURL('**/admin')
  await page.getByPlaceholder('••••').fill('2468')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.waitForURL('**/admin/panel')
  await page.getByText('Panel Administrador').waitFor()
  await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/admin_progress.png', fullPage: true })

  // Add material
  await page.getByRole('button', { name: 'Material' }).click()
  await page.getByPlaceholder('Palabra (ej: MARIPOSA)').fill('MARIPOSA')
  await page.getByPlaceholder('Pista / definición').fill('Insecto con alas de colores')
  await page.getByPlaceholder('Emoji o imagen (ej: 🦋)').fill('🦋')
  await page.getByPlaceholder('Distractores separados por coma').fill('ABEJA, FLOR')
  await page.getByRole('button', { name: 'Guardar palabra' }).click()
  await page.getByText(/Palabra agregada/i).waitFor()
  await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/admin_material.png', fullPage: true })

  // Back to kids and open reading quiz level path via hub
  await page.getByRole('button', { name: /Cerrar sesión admin/i }).click()
  await page.waitForURL((url) => url.pathname === '/')
  await page.getByRole('heading', { name: /¿Quién va a jugar hoy/i }).waitFor()
  await page.locator('button', { has: page.getByRole('img', { name: /Avatar de Isabella/i }) }).click()
  await page.waitForURL('**/dashboard')
  await page.getByRole('img', { name: /Avatar de Isabella/i }).waitFor()
  await page.getByRole('button', { name: /Aprende a leer/i }).click()
  await page.waitForURL('**/games/aprende-a-leer')
  await page.getByText(/Quiz de palabras/i).waitFor()
  await page.getByText(/Práctica de lectura/i).waitFor()
  await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/reading_modules.png', fullPage: true })

  console.log('SMOKE_ADMIN_OK')
  await browser.close()
}

main().catch((error) => {
  console.error('SMOKE_ADMIN_FAIL', error)
  process.exit(1)
})
