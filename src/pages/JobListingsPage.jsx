import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jobsData from '../data/jobs.json';

export default function JobListingsPage({ showApplications = false }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [userApplications, setUserApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

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
      } else {
        // Normal mode: show all active jobs
        const activeJobs = jobsData.jobs.filter(job => job.status === 'active');
        setJobs(activeJobs);
        
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

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-medium text-gray-600">
            {showApplications 
              ? "You haven't applied to any jobs yet" 
              : "No job offers available at the moment"}
          </h2>
          <p className="mt-2 text-gray-500">
            {showApplications 
              ? "Browse our job listings and apply to positions that interest you" 
              : "Please check back later for new opportunities"}
          </p>
          {showApplications && (
            <button
              onClick={() => navigate('/jobs')}
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Browse Jobs
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
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
      )}
    </div>
  );
}