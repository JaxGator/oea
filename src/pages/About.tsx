export default function About() {
  return (
    <div className="min-h-screen bg-[#222222] text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <p className="text-lg">
            Outdoor Energy Adventures is a non-profit organization dedicated to providing outdoor experiences and adventures to youth and young adults. Our mission is to inspire and empower the next generation of outdoor enthusiasts and environmental stewards through meaningful outdoor experiences.
          </p>

          <p className="text-lg">
            We believe that everyone should have access to outdoor recreation and the opportunity to develop a connection with nature. Through our programs, we strive to remove barriers and create inclusive spaces where participants can challenge themselves, build confidence, and develop leadership skills.
          </p>

          <div className="bg-white/5 p-8 rounded-lg mt-12">
            <h2 className="text-2xl font-semibold mb-6">Our Core Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#0d97d1]">Accessibility</h3>
                <p>Making outdoor recreation accessible to all youth regardless of their background or experience level.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#0d97d1]">Environmental Stewardship</h3>
                <p>Teaching responsible outdoor practices and fostering a connection with nature.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#0d97d1]">Personal Growth</h3>
                <p>Creating opportunities for participants to challenge themselves and develop new skills.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-[#0d97d1]">Community</h3>
                <p>Building a supportive community that encourages and inspires one another.</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Our Impact</h2>
            <p className="text-lg mb-4">
              Since our founding, we have:
            </p>
            <ul className="list-disc list-inside space-y-3 text-lg pl-4">
              <li>Provided outdoor experiences to over 1,000 youth</li>
              <li>Organized 100+ outdoor adventure programs</li>
              <li>Trained 50+ youth in outdoor leadership</li>
              <li>Partnered with 20+ schools and community organizations</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <button className="bg-[#0d97d1] hover:bg-[#0d97d1]/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Involved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}