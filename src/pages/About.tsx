export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
      <div className="max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-6">
          Welcome to Evently, your premier destination for discovering and
          connecting with local events that matter to you. Our platform brings
          together event organizers and attendees, creating meaningful experiences
          and lasting connections.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Our mission is to make event discovery and participation seamless,
          allowing communities to thrive through shared experiences and
          interactions.
        </p>
        <div className="bg-primary-50 p-8 rounded-lg mt-12">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>Community-driven experiences</li>
            <li>Inclusive and accessible events</li>
            <li>Quality over quantity</li>
            <li>Transparent communication</li>
          </ul>
        </div>
      </div>
    </div>
  );
}