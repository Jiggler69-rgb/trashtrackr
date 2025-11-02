export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-emerald-50"></div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.15),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border border-green-200 bg-green-50/80 backdrop-blur mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="font-medium text-green-700">Live in Bangalore</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                Clean Cities<br />Start Here
              </h1>
              
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Join the movement to make Bangalore cleaner. Report trash, track hotspots, and help deploy cleanup resources where they're needed most.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a 
                  href="/report" 
                  className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    Report Trash Now
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </a>
                <a 
                  href="/dashboard" 
                  className="px-8 py-4 rounded-xl border-2 border-gray-300 bg-white font-semibold hover:border-gray-400 hover:shadow-lg transition-all duration-200"
                >
                  View Dashboard
                </a>
              </div>
            </div>

            {/* Right Content - Map */}
            <div className="relative">
              <div className="aspect-square max-w-lg mx-auto rounded-2xl border-2 border-gray-200 shadow-2xl bg-gray-100 relative overflow-hidden">
                {/* Map background with streets */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                {/* Major roads */}
                <div className="absolute top-1/3 left-0 right-0 h-1.5 bg-gray-300"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gray-300"></div>
                <div className="absolute bottom-1/4 left-0 right-0 h-1 bg-gray-300 rotate-12"></div>
                
                {/* Animated trash markers */}
                {[
                  { top: '25%', left: '30%', color: 'red' },
                  { top: '45%', left: '55%', color: 'red', large: true },
                  { top: '60%', left: '25%', color: 'orange' },
                  { top: '35%', left: '70%', color: 'red' },
                  { top: '70%', left: '65%', color: 'orange' },
                  { top: '20%', left: '80%', color: 'red', large: true },
                ].map((marker, i) => (
                  <div key={i} className={`absolute animate-bounce`} style={{ top: marker.top, left: marker.left, animationDelay: `${i * 0.2}s`, animationDuration: '3s' }}>
                    <div className="flex flex-col items-center">
                      <div className={`${marker.large ? 'w-5 h-5' : 'w-4 h-4'} bg-${marker.color}-500 rounded-full border-2 border-white shadow-lg`}></div>
                      <div className={`w-0.5 ${marker.large ? 'h-3' : 'h-2'} bg-${marker.color}-500`}></div>
                    </div>
                  </div>
                ))}
                
                {/* Green markers */}
                {[
                  { top: '50%', left: '40%' },
                  { top: '75%', left: '50%' },
                ].map((marker, i) => (
                  <div key={i} className="absolute" style={{ top: marker.top, left: marker.left }}>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="w-0.5 h-2 bg-green-500"></div>
                    </div>
                  </div>
                ))}
                
                {/* Pulsing circle overlay on largest hotspot */}
                <div className="absolute top-[45%] left-[55%]">
                  <div className="absolute inset-0 -m-8">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 animate-ping"></div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl px-4 py-3 shadow-xl border border-gray-200">
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Hotspots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Cleaned</span>
                    </div>
                  </div>
                </div>
                
                {/* Map label */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-xl px-4 py-2 shadow-xl border border-gray-200 text-sm font-semibold">
                  📍 Bangalore
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three simple steps to make your city cleaner</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="relative text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Spot Trash</h3>
              <p className="text-gray-600">Notice litter or an overflowing bin? Take a quick photo and capture the location.</p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">Report Fast</h3>
              <p className="text-gray-600">Submit your report in seconds. Our system automatically maps the hotspot.</p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Track Impact</h3>
              <p className="text-gray-600">Watch as cities respond with cleanup teams and deploy bins where needed most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why TrashTrackr?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Empowering citizens and cities with data-driven solutions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-4">
                📸
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Reporting</h3>
              <p className="text-gray-600">Snap, tag, and submit trash reports in under 30 seconds from your phone.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-4">
                🗺️
              </div>
              <h3 className="text-xl font-bold mb-3">Heatmap Analytics</h3>
              <p className="text-gray-600">Visualize trash hotspots with real-time heatmaps powered by community data.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3">Data Insights</h3>
              <p className="text-gray-600">Export detailed reports and insights to help cities make informed decisions.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-4">
                👥
              </div>
              <h3 className="text-xl font-bold mb-3">Community Driven</h3>
              <p className="text-gray-600">Join active citizens working together for cleaner neighborhoods across Bangalore.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Updates</h3>
              <p className="text-gray-600">Get instant updates when your reported areas are cleaned and resolved.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-2xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Deployment</h3>
              <p className="text-gray-600">Help cities deploy cleanup resources and bins where they're needed most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-10 text-blue-100">Join the community and start reporting trash in your area today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/report" 
              className="px-10 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              Report Your First Trash
            </a>
            <a 
              href="/dashboard" 
              className="px-10 py-4 rounded-xl border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition-all duration-200"
            >
              Explore Dashboard
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
