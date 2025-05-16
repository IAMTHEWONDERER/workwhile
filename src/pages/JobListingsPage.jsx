import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jobsData from '../data/jobs.json';

export default function JobListingsPage({ showApplications = false }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [userApplications, setUserApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(9);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salary: '',
    company: ''
  });

  // Show/hide filters on mobile
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      if (showApplications && isAuthenticated) {
        // Get user applications from localStorage
        const applications = JSON.parse(localStorage.getItem('userApplications') || '[]');
        const userApps = applications.filter(app => app.userId === user.id);
        setUserApplications(userApps);
        
        // Filter jobs that user has applied to
        const appliedJobIds = userApps.map(app => app.jobId);
        const appliedJobs = jobsData.jobs.filter(job => appliedJobIds.includes(job.id));
        setJobs(appliedJobs);
        setFilteredJobs(appliedJobs);
      } else {
        // Normal mode: show all active jobs
        const activeJobs = jobsData.jobs.filter(job => job.status === 'active');
        setJobs(activeJobs);
        setFilteredJobs(activeJobs);
        
        if (isAuthenticated) {
          // Get user applications to display "Applied" badge
          const applications = JSON.parse(localStorage.getItem('userApplications') || '[]');
          const userApps = applications.filter(app => app.userId === user.id);
          setUserApplications(userApps);
          
          // Get saved jobs
          const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
          const userSaved = saved.filter(item => item.userId === user.id);
          setSavedJobs(userSaved);
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, [showApplications, isAuthenticated, user]);

  // Apply filters and search when filters, search term, or jobs change
  useEffect(() => {
    const applyFiltersAndSearch = () => {
      let result = [...jobs];

      // Apply search term first
      if (searchTerm.trim()) {
        const lowercasedSearch = searchTerm.toLowerCase();
        result = result.filter(job => 
          job.title.toLowerCase().includes(lowercasedSearch) ||
          job.company.toLowerCase().includes(lowercasedSearch) ||
          job.description?.toLowerCase().includes(lowercasedSearch) ||
          job.location.toLowerCase().includes(lowercasedSearch)
        );
      }

      // Filter by location
      if (filters.location) {
        result = result.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // Filter by job type
      if (filters.jobType) {
        result = result.filter(job => 
          job.type === filters.jobType
        );
      }

      // Filter by salary range
      if (filters.salary) {
        // Assuming salary filter values are like "50000-80000"
        const [min, max] = filters.salary.split('-').map(Number);
        result = result.filter(job => {
          // Extract salary number from string like "$50,000 - $80,000"
          const salaryText = job.salary;
          const salaryNumbers = salaryText.match(/\d+/g);
          if (salaryNumbers && salaryNumbers.length) {
            const jobSalary = parseInt(salaryNumbers[0].replace(/,/g, ''));
            return jobSalary >= min && (!max || jobSalary <= max);
          }
          return false;
        });
      }

      // Filter by company
      if (filters.company) {
        result = result.filter(job => 
          job.company.toLowerCase().includes(filters.company.toLowerCase())
        );
      }

      setFilteredJobs(result);
      setCurrentPage(1); // Reset to first page when filters or search change
    };

    applyFiltersAndSearch();
  }, [filters, searchTerm, jobs]);

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };
  
  const hasAppliedToJob = (jobId) => {
    return userApplications.some(app => app.jobId === jobId);
  };
  
  const isJobSaved = (jobId) => {
    return savedJobs.some(item => item.jobId === jobId);
  };

  const handleSaveJob = (e, jobId) => {
    e.stopPropagation(); // Stop click event from bubbling up
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/jobs' } });
      return;
    }
    
    const savedJobsArray = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    const alreadySaved = savedJobsArray.some(
      item => item.userId === user.id && item.jobId === jobId
    );
    
    if (alreadySaved) {
      // Remove job from saved
      const updatedSavedJobs = savedJobsArray.filter(
        item => !(item.userId === user.id && item.jobId === jobId)
      );
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      
      // Update state
      setSavedJobs(prev => prev.filter(item => item.jobId !== jobId));
    } else {
      // Add job to saved
      const newSavedJob = {
        userId: user.id,
        jobId: jobId,
        savedAt: new Date().toISOString()
      };
      
      savedJobsArray.push(newSavedJob);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobsArray));
      
      // Update state
      setSavedJobs(prev => [...prev, newSavedJob]);
    }
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear all filters and search
  const clearAll = () => {
    setFilters({
      location: '',
      jobType: '',
      salary: '',
      company: ''
    });
    setSearchTerm('');
  };

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    if (!jobs.length) return [];
    return [...new Set(jobs.map(job => job[key]))].filter(Boolean);
  };

  const uniqueLocations = getUniqueValues('location');
  const uniqueJobTypes = getUniqueValues('type');
  const uniqueCompanies = getUniqueValues('company');

  // Salary ranges for dropdown
  const salaryRanges = [
    { value: '0-3500', label: 'Up to 3500 MAD' },
    { value: '3501-7000', label: '3500-7000 MAD' },
    { value: '7001-10000', label: '7001-10000 MAD' },
    { value: '10001-99999', label: '10000+ MAD' }
  ];

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 mt-24 text-center">Loading available positions...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-24 mb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {showApplications ? 'My Job Applications' : 'Available Job Opportunities'}
        </h1>
        <p className="text-gray-600 mt-2">
          {showApplications 
            ? 'Track the status of your job applications' 
            : 'Browse our current openings and find your next career move'}
        </p>
      </div>

      {/* Search and Filters Section */}
      {!showApplications && (
        <>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search jobs by title, company, or keywords..."
                className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium"
            >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters */}
          <div className={`mb-8 bg-white border border-gray-200 rounded-lg shadow-sm ${!showFilters && 'hidden md:block'}`}>
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">Filters</h2>
                <button
                  onClick={clearAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Job Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <div className="relative">
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All Types</option>
                    {uniqueJobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Salary Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <div className="relative">
                  <select
                    name="salary"
                    value={filters.salary}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All Ranges</option>
                    {salaryRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Company Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <div className="relative">
                  <select
                    name="company"
                    value={filters.company}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">All Companies</option>
                    {uniqueCompanies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex flex-wrap gap-2">
                {(searchTerm || filters.location || filters.jobType || filters.salary || filters.company) ? (
                  <>
                    <span className="text-sm text-gray-600 my-1">Active filters:</span>
                    
                    {searchTerm && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Search: {searchTerm}
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    )}
                    
                    {filters.location && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Location: {filters.location}
                        <button 
                          onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    )}
                    
                    {filters.jobType && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Type: {filters.jobType}
                        <button 
                          onClick={() => setFilters(prev => ({ ...prev, jobType: '' }))}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    )}
                    
                    {filters.salary && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Salary: {salaryRanges.find(r => r.value === filters.salary)?.label}
                        <button 
                          onClick={() => setFilters(prev => ({ ...prev, salary: '' }))}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    )}
                    
                  </>
                ) : (
                  <span className="text-sm text-gray-500">No filters applied</span>
                )}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredJobs.length}</span> results
              {filteredJobs.length !== jobs.length && (
                <> out of <span className="font-medium">{jobs.length}</span> jobs</>
              )}
            </p>
            
            {/* Sort options could go here */}
          </div>
        </>
      )}

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-600">
            {showApplications 
              ? "You haven't applied to any jobs yet" 
              : "No job offers match your criteria"}
          </h2>
          <p className="mt-2 text-gray-500">
            {showApplications 
              ? "Browse our job listings and apply to positions that interest you" 
              : "Try adjusting your search terms or filters"}
          </p>
          {showApplications ? (
            <button
              onClick={() => navigate('/jobs')}
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </button>
          ) : (
            <button
              onClick={clearAll}
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentJobs.map(job => (
              <div
                key={job.id}
                className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => handleViewJob(job.id)}
              >
                {/* Applied badge */}
                {hasAppliedToJob(job.id) && !showApplications && (
                  <div className="absolute top-0 right-0 mt-2 mr-2">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                      Applied
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 font-medium">{job.company}</p>
                  <p className="mt-1 text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {job.location}
                  </p>
                  {job.type && (
                    <p className="mt-1 text-gray-600">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                        {job.type}
                      </span>
                    </p>
                  )}
                  <p className="mt-2 text-gray-700 font-medium">{job.salary}</p>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Posted on: {new Date(job.postedDate).toLocaleDateString()}</p>
                    
                    {showApplications && (
                      <p className="mt-1 text-blue-600 font-medium">
                        Status: {
                          userApplications.find(app => app.jobId === job.id)?.status || 'Pending'
                        }
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="border-t px-6 py-3 bg-gray-50 flex justify-between">
                  <button
                    className={`${
                      isJobSaved(job.id) 
                        ? 'text-blue-700' 
                        : 'text-gray-600 hover:text-blue-600'
                    } font-medium text-sm flex items-center`}
                    onClick={(e) => handleSaveJob(e, job.id)}
                  >
                    {isJobSaved(job.id) ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                        </svg>
                        Saved
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                        </svg>
                        Save
                      </>
                    )}
                  </button>
                  
                  <button
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    View Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {filteredJobs.length > jobsPerPage && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {/* Previous Page Button */}
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium
                    ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                      ${currentPage === index + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                {/* Next Page Button */}
                <button
                  onClick={() => paginate(currentPage < Math.ceil(filteredJobs.length / jobsPerPage) ? currentPage + 1 : currentPage)}
                  disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium
                    ${currentPage === Math.ceil(filteredJobs.length / jobsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}