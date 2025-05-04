import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeProfileSetup } from '../utils/slices/authSlice';
import ExperienceSelector from '../components/profileSetup/ExperienceSelector';
import SkillsSelector from '../components/profileSetup/SkillsSelector';
import JobTitleSelector from '../components/profileSetup/JobTitleSelector';
import PreferencesSelector from '../components/profileSetup/PreferencesSelector';

const dummySkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker',
  'Kubernetes', 'SQL', 'MongoDB', 'GraphQL', 'CSS', 'HTML', 'Git', 'CI/CD',
  'Flutter', 'Swift', 'Java', 'C#', 'PHP', 'Ruby', 'Vue', 'Angular',
  'Firebase', 'Redux', 'Django', 'Spring Boot', 'TensorFlow', 'Machine Learning',
  'Data Science', 'DevOps', 'Cloud Computing', 'Linux', 'Agile', 'Scrum',
  'Testing', 'UI/UX Design', 'Adobe XD', 'Figma', 'Product Management'
];

const dummyJobTitles = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Mobile App Developer', 'UI/UX Designer', 'Data Scientist',
  'DevOps Engineer', 'Cloud Architect', 'Product Manager',
  'QA Engineer', 'Cybersecurity Analyst', 'Machine Learning Engineer',
  'Database Administrator', 'Technical Writer', 'Network Engineer',
  'Systems Analyst', 'Blockchain Developer', 'AR/VR Developer',
  'Game Developer', 'Technical Project Manager'
];

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    experienceLevel: '',
    skills: [],
    jobTitles: [],
    preferences: {
      workType: [],
      salaryRange: { min: 5000, max: 15000 },
      locations: []
    }
  });

  const handleExperienceChange = (level) => {
    setProfileData({
      ...profileData,
      experienceLevel: level
    });
    goToNextStep();
  };

  const handleSkillsChange = (selectedSkills) => {
    setProfileData({
      ...profileData,
      skills: selectedSkills
    });
    goToNextStep();
  };

  const handleJobTitlesChange = (selectedTitles) => {
    setProfileData({
      ...profileData,
      jobTitles: selectedTitles
    });
    goToNextStep();
  };

  const handlePreferencesChange = (preferences) => {
    setProfileData({
      ...profileData,
      preferences
    });
  };

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Dispatch the action to complete profile setup
      await dispatch(completeProfileSetup(profileData)).unwrap();
      
      // Navigate to jobs page after successful profile setup
      navigate('/jobs', { replace: true });
    } catch (error) {
      console.error('Failed to complete profile setup:', error);
      // You could handle errors here, show a notification, etc.
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-lg text-gray-600">
            Help us match you with the perfect job opportunities
          </p>
          <p className="mt-2 text-sm text-blue-600">
            Welcome, {user?.name || 'New User'}! Let's set up your profile.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Experience', 'Skills', 'Job Titles', 'Preferences'].map((step, index) => (
              <div 
                key={index} 
                className={`text-sm font-medium ${currentStep > index + 1 ? 'text-blue-600' : 'text-gray-500'}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep - 1) * 33.3}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          {currentStep === 1 && (
            <ExperienceSelector 
              onSelect={handleExperienceChange}
              selectedLevel={profileData.experienceLevel}
            />
          )}

          {currentStep === 2 && (
            <SkillsSelector 
              availableSkills={dummySkills}
              selectedSkills={profileData.skills}
              onChange={handleSkillsChange}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <JobTitleSelector 
              availableTitles={dummyJobTitles}
              selectedTitles={profileData.jobTitles}
              onChange={handleJobTitlesChange}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <PreferencesSelector 
              preferences={profileData.preferences}
              onChange={handlePreferencesChange}
              onBack={handleBack}
              onComplete={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;