import { useState, forwardRef } from 'react';
import { Search, DollarSign, Lightbulb, BookOpen, MessageCircle, ChevronDown, Award, Briefcase, Clock } from 'lucide-react';

const SalaryGuidePage = forwardRef((props, ref) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['All', 'Salary Negotiation', 'Interview Tips', 'Career Growth', 'Benefits'];
  
  const salaryGuides = [
    {
      title: "Salary Negotiation Fundamentals",
      description: "Master the art of negotiating your worth with confidence and strategy.",
      category: "Salary Negotiation",
      icon: <DollarSign size={24} style={{ color: '#3c78e6' }} />,
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Interview Question Preparation",
      description: "Practice answers to common interview questions and impress hiring managers.",
      category: "Interview Tips",
      icon: <MessageCircle size={24} style={{ color: '#3c78e6' }} />,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Benefits Package Analysis",
      description: "Learn how to evaluate the full compensation package beyond just the salary.",
      category: "Benefits",
      icon: <Award size={24} style={{ color: '#3c78e6' }} />,
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Salary Research Strategies",
      description: "Discover how to research market rates and position yourself optimally.",
      category: "Salary Negotiation",
      icon: <BookOpen size={24} style={{ color: '#3c78e6' }} />,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Career Advancement Tactics",
      description: "Strategic approaches to climb the ladder and increase your earning potential.",
      category: "Career Growth",
      icon: <Briefcase size={24} style={{ color: '#3c78e6' }} />,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Interview Body Language",
      description: "Non-verbal communication tips that will help you make a strong impression.",
      category: "Interview Tips",
      icon: <Lightbulb size={24} style={{ color: '#3c78e6' }} />,
      image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  const filteredGuides = salaryGuides.filter(guide => 
    (selectedCategory === 'All' || guide.category === selectedCategory) &&
    (guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     guide.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const negotiationSteps = [
    {
      title: "Research",
      description: "Gather data on industry standards and company compensation.",
      icon: <BookOpen size={22} style={{ color: '#EDC418' }} />
    },
    {
      title: "Know Your Value",
      description: "Identify your unique skills and contributions to strengthen your position.",
      icon: <Award size={22} style={{ color: '#EDC418' }} />
    },
    {
      title: "Practice",
      description: "Rehearse your negotiation conversation to build confidence.",
      icon: <MessageCircle size={22} style={{ color: '#EDC418' }} />
    },
    {
      title: "Timing",
      description: "Choose the right moment to initiate compensation discussions.",
      icon: <Clock size={22} style={{ color: '#EDC418' }} />
    }
  ];

  return (
    <div ref={ref} className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Header section with background gradient */}
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-blue-500 to-blue-600 p-8 md:p-12">
          {/* Background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-300 opacity-20 blur-3xl transform translate-x-1/4 -translate-y-1/4" 
              style={{ backgroundColor: '#EDC418' }}></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-300 opacity-20 blur-3xl transform -translate-x-1/4 translate-y-1/4" 
              style={{ backgroundColor: '#3c78e6' }}></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Salary Guide & Career Resources</h1>
            <p className="text-white text-lg md:text-xl opacity-90 max-w-xl">
              Expert advice to help you negotiate better compensation and ace your job interviews
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-12">
          <div className="relative max-w-3xl mx-auto">
            <input 
              type="text" 
              placeholder="Search for salary guides, negotiation tips, interview advice..." 
              className="w-full px-6 py-4 pr-12 text-lg rounded-full shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent bg-white"
              style={{ focusRingColor: '#3c78e6' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <button className="text-white p-2 rounded-full transition" style={{ backgroundColor: '#3c78e6' }}>
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`py-2 px-5 rounded-full text-sm md:text-base font-medium transition ${
                selectedCategory === category 
                  ? 'text-white shadow-md' 
                  : 'text-gray-600 bg-white border border-gray-200 hover:border-blue-300'
              }`}
              style={{ backgroundColor: selectedCategory === category ? '#3c78e6' : '' }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Salary Negotiation Steps */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#3c78e6' }}>
              Master the Art of Salary Negotiation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these proven steps to negotiate your compensation with confidence
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {negotiationSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" 
                     style={{ backgroundColor: 'rgba(60, 120, 230, 0.1)' }}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Career Guides */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#3c78e6' }}>
              Career Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive guides to help you advance your career
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-48 overflow-hidden">
                  <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: 'rgba(60, 120, 230, 0.1)' }}>
                      {guide.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{guide.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  <button 
                    className="text-sm font-medium px-4 py-2 rounded-full transition hover:bg-opacity-90"
                    style={{ backgroundColor: '#EDC418', color: '#333' }}
                  >
                    Read Guide
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredGuides.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No guides found for "{searchQuery}". Try different keywords or browse all categories.</p>
            </div>
          )}
        </div>
        
        {/* Salary Calculator Teaser */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/5 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-semibold mb-3" style={{ color: '#3c78e6' }}>
                Calculate Your Worth
              </h3>
              <p className="text-gray-600 mb-6">
                Use our salary calculator to determine your market value based on your skills, 
                experience, location, and industry standards.
              </p>
              <button 
                className="px-6 py-3 rounded-full text-white font-medium transition hover:bg-opacity-90"
                style={{ backgroundColor: '#3c78e6' }}
              >
                Try Salary Calculator
              </button>
            </div>
            <div className="md:w-2/5">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Average Salary Range</span>
                  <span className="text-xl font-bold" style={{ color: '#3c78e6' }}>$65,000 - $85,000</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-3">
                  <div className="h-full rounded-full" style={{ width: '70%', backgroundColor: '#EDC418' }}></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Entry Level</span>
                  <span>Senior Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="flex justify-center mt-16">
        <div className="animate-bounce">
          <ChevronDown size={32} style={{ color: '#3c78e6' }} />
        </div>
      </div>
    </div>
  );
});

export default SalaryGuidePage;