import React, { useState, useRef } from 'react';
import { Job, Application, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Upload,
  User as UserIcon,
  FileText,
  CheckCircle,
  Plus,
  X,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CandidateDashboardProps {
  currentUser: User;
  jobs: Job[];
  applications: Application[];
  onApply: (jobId: string, coverLetter: string, resumeData?: string, resumeName?: string) => void;
  onUpdateProfile: (updatedProfile: Partial<User>) => void;
}

export default function CandidateDashboard({
  currentUser,
  jobs,
  applications,
  onApply,
  onUpdateProfile,
}: CandidateDashboardProps) {
  const [activeTab, setActiveTab] = useState<'find' | 'applications' | 'profile'>('find');
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] || null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  // Application Form State
  const [coverLetter, setCoverLetter] = useState('');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');
  const [newSkill, setNewSkill] = useState('');
  const [profileSkills, setProfileSkills] = useState<string[]>(currentUser.skills || []);
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(currentUser.profilePhoto);
  const [resumeBase64, setResumeBase64] = useState<string | undefined>(currentUser.resume);
  const [resumeName, setResumeName] = useState<string | undefined>(currentUser.resumeName);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Filter Jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesLocation =
      selectedLocation === 'All' ||
      (selectedLocation === 'Remote' && job.location.toLowerCase().includes('remote')) ||
      (selectedLocation === 'Onsite' && !job.location.toLowerCase().includes('remote'));

    return matchesSearch && matchesType && matchesLocation;
  });

  // Handle Profile Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        onUpdateProfile({ profilePhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Resume Upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setResumeBase64(base64String);
        setResumeName(file.name);
        onUpdateProfile({ resume: base64String, resumeName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Profile Settings
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: profileName,
      bio: profileBio,
      skills: profileSkills,
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  // Skill Managers
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !profileSkills.includes(newSkill.trim())) {
      const updated = [...profileSkills, newSkill.trim()];
      setProfileSkills(updated);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = profileSkills.filter((s) => s !== skillToRemove);
    setProfileSkills(updated);
  };

  // Apply Action
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError('');

    if (!selectedJob) return;

    // Must have a resume uploaded to apply
    if (!resumeBase64) {
      setApplyError('Please upload your resume in the Profile tab first before applying.');
      return;
    }

    onApply(selectedJob.id, coverLetter, resumeBase64, resumeName);
    setApplySuccess(true);
    setCoverLetter('');
    setTimeout(() => {
      setApplySuccess(false);
    }, 3500);
  };

  // Get status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hired':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const hasAppliedToSelected = selectedJob
    ? applications.some((app) => app.jobId === selectedJob.id && app.candidateId === currentUser.id)
    : false;

  const myApplications = applications.filter((app) => app.candidateId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('find')}
          className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === 'find'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Search className="w-4 h-4" />
          Find Jobs
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer relative ${
            activeTab === 'applications'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          My Applications
          {myApplications.length > 0 && (
            <span className="ml-1 bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {myApplications.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          My Profile
        </button>
      </div>

      {/* Main Container based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'find' && (
          <motion.div
            key="find"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Filters and Search - Column Left */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-xs space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, company, keyword..."
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                      Job Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-1.5 focus:outline-none"
                    >
                      <option value="All">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Remote">Remote</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-1.5 focus:outline-none"
                    >
                      <option value="All">All Locations</option>
                      <option value="Remote">Remote Only</option>
                      <option value="Onsite">Onsite / Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Job Listings List */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                <p className="text-xs text-neutral-500 font-medium px-1">
                  Showing {filteredJobs.length} jobs available
                </p>
                {filteredJobs.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                    <Briefcase className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-neutral-600">No jobs found</p>
                    <p className="text-xs text-neutral-400 mt-1">Try adjusting your filters or search criteria.</p>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJob(job);
                        setApplySuccess(false);
                        setApplyError('');
                      }}
                      className={`p-4 bg-white rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                        selectedJob?.id === job.id
                          ? 'border-neutral-900 ring-1 ring-neutral-900 bg-neutral-50/20'
                          : 'border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded-md">
                            {job.company}
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-900 mt-1.5">{job.title}</h4>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-y-2 gap-x-3 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Active Job Detail - Column Right */}
            <div className="lg:col-span-7">
              {selectedJob ? (
                <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 space-y-5 text-left">
                  {/* Top Branding */}
                  <div className="border-b border-neutral-100 pb-4">
                    <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2 py-0.5 rounded">
                      {selectedJob.company}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-2">{selectedJob.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {selectedJob.location}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                        {selectedJob.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                        {selectedJob.type}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Role Description
                    </h4>
                    <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                      {selectedJob.description}
                    </p>
                  </div>

                  {/* Requirements list */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Key Requirements
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Metadata block */}
                  <div className="bg-neutral-50 rounded-lg p-3 text-xs text-neutral-500 flex justify-between items-center">
                    <span>Posted by: <span className="font-semibold text-neutral-700">{selectedJob.recruiterName}</span></span>
                    <span>Date: <span className="font-semibold text-neutral-700">{new Date(selectedJob.postedAt).toLocaleDateString()}</span></span>
                  </div>

                  {/* Apply Section */}
                  <div className="border-t border-neutral-100 pt-5 mt-4">
                    {hasAppliedToSelected ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold">Application Submitted!</p>
                          <p className="text-xs text-emerald-600/90 mt-0.5">
                            You have already applied for this role. Track its progress in the "My Applications" tab.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-neutral-800">Apply for this role</h4>
                        
                        {applySuccess ? (
                          <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-semibold">Your application was submitted successfully!</span>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleApplySubmit} className="space-y-3">
                            {applyError && (
                              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-lg">
                                {applyError}
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-medium text-neutral-600 mb-1">
                                Cover Letter / Note to Recruiter
                              </label>
                              <textarea
                                required
                                rows={3}
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Introduce yourself and explain why you're a great fit for this job..."
                                className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                              />
                            </div>

                            {/* Resume Status indicator */}
                            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200/50">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-neutral-500" />
                                <div className="text-left">
                                  <p className="text-xs font-semibold text-neutral-700">Attached Resume</p>
                                  <p className="text-[10px] text-neutral-500">
                                    {resumeName ? resumeName : 'No resume uploaded yet'}
                                  </p>
                                </div>
                              </div>
                              {!resumeBase64 && (
                                <button
                                  type="button"
                                  onClick={() => setActiveTab('profile')}
                                  className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  Upload Resume
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-xs font-medium rounded-lg transition-all shadow-xs cursor-pointer"
                            >
                              Submit Application
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                  <p className="text-sm text-neutral-500">Select a job post to view detailed information and apply.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <motion.div
            key="applications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs text-left"
          >
            <h3 className="text-base font-semibold text-neutral-900 mb-1">Your Submitted Applications</h3>
            <p className="text-xs text-neutral-500 mb-5">
              Review current state, recruiter comments, and statuses for your job applications.
            </p>

            {myApplications.length === 0 ? (
              <div className="p-12 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                <FileText className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-600">No applications yet</p>
                <p className="text-xs text-neutral-400 mt-1">Browse the job list and submit your first application today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 border border-neutral-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-xs transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded-md">
                          {app.company}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-neutral-900">{app.jobTitle}</h4>
                      <p className="text-xs text-neutral-500 italic max-w-xl truncate">
                        Cover Note: "{app.coverLetter}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between md:justify-end">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="max-w-[120px] truncate font-mono">{app.resumeName || 'Resume'}</span>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Bio & Details Form */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs">
              <h3 className="text-base font-semibold text-neutral-900 mb-1">Edit Your Candidate Profile</h3>
              <p className="text-xs text-neutral-500 mb-5">
                This information will be attached to your applications when applying to recruiters.
              </p>

              {profileSuccess && (
                <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg mb-4">
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full text-sm border border-neutral-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Brief Professional Bio</label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Tell us about yourself, your goals, or your project stack..."
                    className="w-full text-sm border border-neutral-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-xs font-medium rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </form>

              {/* Skill set Manager */}
              <div className="border-t border-neutral-100 pt-5 mt-5">
                <label className="block text-xs font-medium text-neutral-600 mb-2">My Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profileSkills.length === 0 ? (
                    <span className="text-xs text-neutral-400">No skills added yet. Add skills below!</span>
                  ) : (
                    profileSkills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-700 pl-2.5 pr-1 py-0.5 rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="w-4 h-4 rounded-full hover:bg-neutral-200/80 flex items-center justify-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js, Figma, SQL"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 text-xs border border-neutral-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-neutral-900 text-white hover:bg-neutral-850 rounded-lg flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Resume & Profile Photo - Column Right */}
            <div className="lg:col-span-4 space-y-4">
              {/* Profile Photo Upload card */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs text-center">
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  Profile Photo
                </h4>
                <div className="relative w-24 h-24 mx-auto mb-3">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-full object-cover border-2 border-neutral-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 mx-auto">
                      <UserIcon className="w-10 h-10" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-neutral-900 hover:bg-neutral-850 text-white rounded-full flex items-center justify-center shadow-xs cursor-pointer border border-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-[10px] text-neutral-400">
                  Upload profile picture. Supported formats: JPG, PNG.
                </p>
              </div>

              {/* Resume File Upload card */}
              <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-xs text-center">
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                  Resume Document
                </h4>
                <div className="border border-dashed border-neutral-200 rounded-lg p-4 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100/50 transition-all">
                  <FileText className="w-8 h-8 text-neutral-400 mb-2" />
                  {resumeName ? (
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-neutral-700 truncate max-w-[150px] mx-auto">
                        {resumeName}
                      </p>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono border border-emerald-100">
                        Uploaded
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 mb-2">No file attached yet</p>
                  )}
                  <button
                    onClick={() => resumeInputRef.current?.click()}
                    className="px-3 py-1 bg-white border border-neutral-200 hover:bg-neutral-50 rounded text-xs font-medium text-neutral-700 shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-neutral-500" />
                    Select PDF/DOCX
                  </button>
                  <input
                    type="file"
                    ref={resumeInputRef}
                    onChange={handleResumeUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-2">
                  Attach your resume. This document is required to submit job applications.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
