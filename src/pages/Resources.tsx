import { Card } from "@/components/ui/card";

const Resources = () => {
  const resources = [
    {
      section: "Greater Jacksonville Area Outdoor Resources",
      items: [
        { label: "Jacksonville Arboretum & Gardens", url: "https://www.jacksonvillearboretum.org/" },
        { label: "Timucuan Ecological & Historic Preserve", url: "https://www.nps.gov/timu/index.htm" },
        { label: "Jacksonville-Baldwin Rail Trail", url: "https://www.floridastateparks.org/parks-and-trails/jacksonville-baldwin-rail-trail" },
        { label: "Kayak Amelia", url: "https://kayakamelia.com/" },
        { label: "Guana River State Park", url: "https://www.floridastateparks.org/parks-and-trails/guana-tolomato-matanzas-national-estuarine-research-reserve" },
        { label: "Hanna Park Campground", url: "https://www.coj.net/departments/parks-and-recreation/recreation-and-community-programming/hanna-park" },
        { label: "Little Talbot Island State Park", url: "https://www.floridastateparks.org/parks-and-trails/little-talbot-island-state-park" },
        { label: "Catty Shack Ranch Wildlife Sanctuary", url: "https://cattyshack.org/" },
        { label: "Tree Hill Nature Center", url: "https://treehill.org/" },
        { label: "Atlantic Beach Surfing Guide", url: "https://magicseaweed.com/Atlantic-Beach-Surf-Report/" },
        { label: "Jacksonville Beach Fishing Pier", url: "https://www.visitjacksonville.com/directory/jacksonville-beach-pier/" },
      ],
    },
    {
      section: "Statewide Florida Outdoor Resources",
      items: [
        { label: "Florida Trail Association", url: "https://www.floridatrail.org/" },
        { label: "AllTrails Florida", url: "https://www.alltrails.com/us/florida" },
        { label: "Florida Paddling Trails Association", url: "https://www.floridapaddlingtrails.com/" },
        { label: "Ichetucknee Springs State Park", url: "https://www.floridastateparks.org/parks-and-trails/ichetucknee-springs-state-park" },
        { label: "Reserve America Florida Campgrounds", url: "https://www.reserveamerica.com/explore/florida/FL/" },
        { label: "Hipcamp Florida", url: "https://www.hipcamp.com/en-US/d/united-states/florida/camping" },
        { label: "Everglades National Park", url: "https://www.nps.gov/ever/index.htm" },
        { label: "Florida Fish and Wildlife Conservation Commission (FWC)", url: "https://myfwc.com/" },
        { label: "Florida Bike Trails", url: "https://www.bikeflorida.net/" },
        { label: "Rails-to-Trails Conservancy", url: "https://www.traillink.com/state/fl-trails/" },
        { label: "Florida Beaches Guide", url: "https://www.floridabeachguide.com/" },
        { label: "Surfline Florida", url: "https://www.surfline.com/" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <img
          src="https://images.unsplash.com/photo-1575540203949-54ccd7a66d98"
          alt="Downtown Jacksonville"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Resources
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4">
        {resources.map((resource, index) => (
          <Card key={index} className="mb-8 p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
              {resource.section}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resource.items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <span className="text-primary hover:text-primary/80 transition-colors">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Resources;