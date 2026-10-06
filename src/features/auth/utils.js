/** The page each role lands on after logging in. */
export function homeForRole(role) {
  if (role === 'owner') return '/owner'
  if (role === 'rider') return '/rider'
  return '/'
}
