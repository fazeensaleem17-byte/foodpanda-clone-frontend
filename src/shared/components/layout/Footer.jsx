import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="space-y-1.5">
          <Logo />
          <p className="max-w-md text-xs text-gray-500">
            This is an educational project for learning purposes and is not affiliated with Foodpanda.
          </p>
        </div>
        <p className="text-xs text-gray-400">React + Vite frontend · Django REST backend</p>
      </div>
    </footer>
  )
}
