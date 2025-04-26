import { forwardRef } from 'react';
import { ArrowRight, Code, BriefcaseBusiness, LineChart, BookOpen } from 'lucide-react';

const careerPathways = [
  {
    title: "Technology",
    icon: <Code size={24} />,
    description: "Discover opportunities in software development, cybersecurity, and AI.",
    image: "https://placehold.co/600x400"
  },
  {
    title: "Business",
    icon: <BriefcaseBusiness size={24} />,
    description: "Explore careers in management, entrepreneurship, and consulting.",
    image: "https://placehold.co/600x400"
  },
  {
    title: "Finance",
    icon: <LineChart size={24} />,
    description: "Build expertise in banking, investments, and financial analysis.",
    image: "https://placehold.co/600x400"
  },
  {
    title: "Education",
    icon: <BookOpen size={24} />,
    description: "Shape the future through teaching and educational innovation.",
    image: "https://placehold.co/600x400"
  }
];

const CareerPathwaysSection = forwardRef(({ isVisible }, ref) => {
  return (
    <section 
      ref={ref}
      className="py-24 px-4 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#EDC418' }}>Explore Possibilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: '#3c78e6' }}>Career Pathways</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">Discover diverse career paths tailored to your interests, skills, and aspirations.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerPathways.map((pathway, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-md p-4 transition-all hover:shadow-lg transform duration-1000 delay-${index * 100} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
              <img src={pathway.image} alt={pathway.title} className="w-full h-32 object-cover mb-2 rounded-lg" />
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: index % 2 === 0 ? 'rgba(60, 120, 230, 0.1)' : 'rgba(237, 196, 24, 0.1)' }}>
                <div style={{ color: index % 2 === 0 ? '#3c78e6' : '#EDC418' }}>
                  {pathway.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-1">{pathway.title}</h3>
              <p className="text-gray-600 mb-2">{pathway.description}</p>
              <button className="flex items-center text-sm font-medium" style={{ color: '#3c78e6' }}>
                Explore pathway <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
export default CareerPathwaysSection;