const STORAGE_KEY = 'stc_staff_access'

function readAccess() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { kitchen: false, runner: false }
  } catch {
    return { kitchen: false, runner: false }
  }
}

function writeAccess(access) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(access))
}

export function hasRoleAccess(role) {
  const access = readAccess()
  return Boolean(access[role])
}

export function grantRoleAccess(role) {
  const access = readAccess()
  access[role] = true
  writeAccess(access)
}

export function clearRoleAccess() {
  writeAccess({ kitchen: false, runner: false })
}
