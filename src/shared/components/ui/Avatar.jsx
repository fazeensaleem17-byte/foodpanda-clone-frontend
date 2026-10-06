import { initialsOf } from '@shared/utils/format'

/** Round user avatar: the profile image if there is one, otherwise initials. */
export default function Avatar({ user, size = 'h-9 w-9 text-sm' }) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username
  if (user.profile?.image) {
    return (
      <img
        src={user.profile.image}
        alt=""
        className={`${size} rounded-full object-cover ring-2 ring-white`}
      />
    )
  }
  return (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-600`}
    >
      {initialsOf(name)}
    </span>
  )
}
