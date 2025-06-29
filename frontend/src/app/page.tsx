import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ConvoPilot</h1>
              <span className="ml-2 text-gray-500">🚀</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/features" className="text-gray-500 hover:text-gray-900">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-500 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-900">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/login"
                className="text-gray-500 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link 
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Master Languages Through</span>
            <span className="block text-blue-600">AI-Powered Conversations</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Improve your speaking and writing skills with personalized AI conversations. 
            Get real-time feedback, track your progress, and achieve fluency faster.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link 
                href="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Start Learning Free
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link 
                href="/demo"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Personalized Learning
              </h3>
              <p className="text-gray-500">
                AI adapts to your proficiency level and learning style for optimal progress.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-3xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Real Conversations
              </h3>
              <p className="text-gray-500">
                Practice with natural, engaging conversations on topics you care about.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-3xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Instant Feedback
              </h3>
              <p className="text-gray-500">
                Get immediate corrections and suggestions to improve your grammar and vocabulary.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-3xl mb-4">🌍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Multiple Languages
              </h3>
              <p className="text-gray-500">
                Learn Spanish, French, German, Italian, and many other languages.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-3xl mb-4">📈</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-500">
                Monitor your improvement with detailed analytics and learning insights.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-blue-600 text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Flexible Learning
              </h3>
              <p className="text-gray-500">
                Learn at your own pace with sessions that fit your schedule.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-lg">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white">
                Ready to Start Your Language Journey?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join thousands of learners who are improving their language skills with ConvoPilot.
              </p>
              <div className="mt-8">
                <Link 
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Get Started Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold text-blue-600 mb-4">ConvoPilot</h3>
              <p className="text-gray-500 mb-4">
                The intelligent language learning platform that helps you master languages through AI-powered conversations.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-500 hover:text-gray-900">Features</Link></li>
                <li><Link href="/pricing" className="text-gray-500 hover:text-gray-900">Pricing</Link></li>
                <li><Link href="/api" className="text-gray-500 hover:text-gray-900">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-500 hover:text-gray-900">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-500 hover:text-gray-900">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-500 hover:text-gray-900">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-400">
              © 2024 ConvoPilot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
