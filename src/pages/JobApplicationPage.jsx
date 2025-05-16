import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import jobsData from '../data/jobs.json';

const JobApplicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    availability: '',
    salaryExpectation: ''
  });
  
  const [resumeFile, setResumeFile] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const resumeInputRef = useRef();
  const additionalFilesRef = useRef();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate(`/login`, { state: { from: `/job/${id}/apply` } });
      return;
    }

    // Fetch job data
    const fetchJob = () => {
      const foundJob = jobsData.jobs.find(job => job.id === parseInt(id));
      if (!foundJob) {
        navigate('/jobs');
        return;
      }
      setJob(foundJob);
      setLoading(false);
      
      // Pre-fill user data if available
      if (user) {
        setFormData(prev => ({
          ...prev,
          fullName: user.name || '',
          email: user.email || ''
        }));
      }
    };

    fetchJob();
  }, [id, isAuthenticated, navigate, user]);

  // Check if user has already applied to this job
  const [hasApplied, setHasApplied] = useState(false);
  
  useEffect(() => {
    // This would typically be an API call to check application status
    // For demo purposes, we'll use localStorage
    if (isAuthenticated && job) {
      const userApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
      const applied = userApplications.some(app => 
        app.userId === user.id && app.jobId === parseInt(id)
      );
      setHasApplied(applied);
    }
  }, [isAuthenticated, id, job, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeFile(file);
        setErrors(prev => ({ ...prev, resume: null }));
      } else {
        setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document' }));
        resumeInputRef.current.value = '';
      }
    }
  };

  const handleAdditionalFilesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setErrors(prev => ({ ...prev, additionalFiles: 'Maximum 3 files allowed' }));
      additionalFilesRef.current.value = '';
      return;
    }
    
    const validFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/png'
    );
    
    if (validFiles.length !== files.length) {
      setErrors(prev => ({ ...prev, additionalFiles: 'Some files have invalid formats. Please upload PDF, Word, JPEG, or PNG files' }));
    } else {
      setErrors(prev => ({ ...prev, additionalFiles: null }));
    }
    
    setAdditionalFiles(validFiles);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!resumeFile) {
      newErrors.resume = 'Resume is required';
    }
    
    if (!formData.availability.trim()) {
      newErrors.availability = 'Availability information is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasApplied) {
      alert('You have already applied to this job');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Simulate API call to submit application
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store application in localStorage for demo purposes
      const application = {
        userId: user.id,
        jobId: parseInt(id),
        appliedAt: new Date().toISOString(),
        status: 'pending',
        // In a real app, we would upload files to a server and store URLs
        resumeFileName: resumeFile.name,
        additionalFileNames: additionalFiles.map(file => file.name)
      };
      
      const userApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
      userApplications.push(application);
      localStorage.setItem('userApplications', JSON.stringify(userApplications));
      
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        availability: '',
        salaryExpectation: ''
      });
      setResumeFile(null);
      setAdditionalFiles([]);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      if (additionalFilesRef.current) additionalFilesRef.current.value = '';
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to submit application. Please try again.' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToJob = () => {
    navigate(`/job/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-24 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
        <div className="bg-white border rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your application for <span className="font-semibold">{job.title}</span> at <span className="font-semibold">{job.company}</span> has been successfully submitted. The employer will review your application and contact you if they're interested.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-full hover:bg-gray-200"
            >
              Browse More Jobs
            </button>
            <button
              onClick={handleBackToJob}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700"
            >
              Back to Job Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hasApplied) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
        <div className="mb-6">
          <button
            onClick={handleBackToJob}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Job Details
          </button>
        </div>
        
        <div className="bg-white border rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">You've Already Applied</h1>
          <p className="text-gray-600 mb-6">
            You have already submitted an application for this position. You can check the status of your application in your profile dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200"
            >
              Browse More Jobs
            </button>
            <button
              onClick={() => navigate('/profile/applications')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              View My Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">
      <div className="mb-6">
        <button
          onClick={handleBackToJob}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Job Details
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h1>
          <p className="mt-2 text-gray-600">
            at <span className="font-semibold">{job.company}</span> • {job.location}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-full border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability to Start *
              </label>
              <input
                type="text"
                id="availability"
                name="availability"
                placeholder="e.g., Immediately, 2 weeks notice, etc."
                value={formData.availability}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-full border ${errors.availability ? 'border-red-300' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500`}
              />
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="salaryExpectation" className="block text-sm font-medium text-gray-700">
              Salary Expectations
            </label>
            <input
              type="text"
              id="salaryExpectation"
              name="salaryExpectation"
              placeholder="e.g., $50,000 - $60,000"
              value={formData.salaryExpectation}
              onChange={handleChange}
              className="mt-1 block w-full rounded-full border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={5}
              value={formData.coverLetter}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
            />
          </div>
          
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
              Resume / CV *
            </label>
            <div className="mt-1">
              <input
                type="file"
                id="resume"
                name="resume"
                ref={resumeInputRef}
                onChange={handleResumeUpload}
                className="sr-only"
                accept=".pdf,.doc,.docx"
              />
              <label
                htmlFor="resume"
                className={`relative flex justify-center px-6 py-5 border-2 border-dashed rounded-md cursor-pointer ${
                  errors.resume ? 'border-red-300 bg-red-50' : resumeFile ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="space-y-1 text-center">
                  {resumeFile ? (
                    <>
                      <svg className="mx-auto h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{resumeFile.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <span className="relative font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          Upload a resume
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF or Word up to 10MB</p>
                    </>
                  )}
                </div>
              </label>
              {errors.resume && (
                <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="additionalFiles" className="block text-sm font-medium text-gray-700">
              Additional Files (Optional)
            </label>
            <div className="mt-1">
              <input
                type="file"
                id="additionalFiles"
                name="additionalFiles"
                ref={additionalFilesRef}
                onChange={handleAdditionalFilesUpload}
                className="sr-only"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
              />
              <label
                htmlFor="additionalFiles"
                className={`relative flex justify-center px-6 py-5 border-2 border-dashed rounded-md cursor-pointer ${
                  errors.additionalFiles ? 'border-red-300 bg-red-50' : additionalFiles.length > 0 ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="space-y-1 text-center">
                  {additionalFiles.length > 0 ? (
                    <>
                      <svg className="mx-auto h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{additionalFiles.length} file(s) selected</span>
                      </div>
                      <ul className="text-xs text-gray-500">
                        {additionalFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500">Click to change files</p>
                    </>
                  ) : (
                    <>
                      <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <span className="relative font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          Upload additional files
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Portfolio, certifications, etc. (PDF, Word, JPEG, PNG up to 10MB each)</p>
                    </>
                  )}
                </div>
              </label>
              {errors.additionalFiles && (
                <p className="mt-1 text-sm text-red-600">{errors.additionalFiles}</p>
              )}
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Application...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationPage;