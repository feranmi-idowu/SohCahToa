export default function LoginPage() {
  return (
    <div className="min-h-screen flex">

      {/* left side on deskop */}
      <div className="hidden md:flex w-1/2 bg-brand flex-col items-center justify-center p-12">
        <h1 className="text-white text-4xl font-bold">SohCahToa</h1>
        <p className="text-white/80 text-lg mt-4">Payout BDC</p>
        <p className="text-white/60 text-sm mt-8 text-center max-w-xs">
          Secure foreign exchange and transaction monitoring platform.
        </p>
      </div>

      {/* right side login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500 mb-8">
            Sign in to your account to continue
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Email address
            </label>
            <input
              type="email"
              placeholder="emmanuel@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand text-foreground"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-brand text-foreground"
            />
          </div>

          <button className="w-full bg-brand hover:bg-brand-hover text-white font-semibold py-3 rounded-lg transition-colors">
            Sign in
          </button>

        </div>
      </div>

    </div>
  )
}