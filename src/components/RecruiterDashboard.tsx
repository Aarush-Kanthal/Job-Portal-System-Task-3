import React, { useState } from 'react';
import { Job, Application, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Users,
  Plus,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  User as UserIcon,
  PlusCircle,
  Sparkles
} from 'lucide-react';

interface RecruiterDashboardProps {
  currentUser: User;
  jobs: Job[];
  applications: Application[];
  onAddJob: (newJob: Omit<Job, 'id' | 'recruiterId' | 'recruiterName' | 'postedAt'>) => void;
  onUpdateApplicationStatus: (applicationId: string, status: Application['status']) => void;
}

export default function RecruiterDashboard({
  currentUser,
  jobs,
  applications,
  onAddJob,
  onUpdateApplicationStatus,
}: RecruiterDashboardProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'post-job' | 'applicants'>('jobs');
  
  // Job Post State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Job['type']>('Full-time');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [postSuccess, setPostSuccess] = useState(false);

  // Selector for applicant review
  const [selectedJobId, setSelectedJobId] = useState<string>('All');

  const myJobs = jobs.filter((job) => job.recruiterId === currentUser.id);
  const myApplications = applications.filter((app) => 
    myJobs.some((job) => job.id === app.jobId)
  );

  const filteredApplications = selectedJobId === 'All'
    ? myApplications
    : myApplications.filter(app => app.jobId === selectedJobId);

  // Add requirement to list
  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (reqInput.trim() && !requirements.includes(reqInput.trim())) {
      setRequirements([...requirements, reqInput.trim()]);
      setReqInput('');
    }
  };

  const handleRemoveRequirement = (req: string) => {
    setRequirements(requirements.filter((r) => r !== req));
  };

  // Create/Post job
  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !location || !salary || !description || requirements.length === 0) {
      alert('Please fill out all fields and add at least one requirement.');
      return;
    }

    onAddJob({
      title,
      company,
      location,
      type,
      salary,
      description,
      requirements,
    });

    // Reset Form
    setTitle('');
    setCompany('');
    setLocation('');
    setType('Full-time');
    setSalary('');
    setDescription('');
    setRequirements([]);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab('jobs');
    }, 2500);
  };

  // Get status badge styles
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

  return (
    <div className="space-y-6">
      {/* Sub Header tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === 'jobs'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          My Job Listings
          {myJobs.length > 0 && (
            <span className="ml-1 bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {myJobs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === 'applicants'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Candidate Pipeline
          {myApplications.length > 0 && (
            <span className="ml-1 bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {myApplications.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('post-job')}
          className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === 'post-job'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Jobs List Tab */}
        {activeTab === 'jobs' && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 text-left"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Your Posted Positions</h3>
                <p className="text-xs text-neutral-500">Manage and view active positions on the platform.</p>
              </div>
              <button
                onClick={() => setActiveTab('post-job')}
                className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs hover:bg-neutral-850 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Add Position
              </button>
            </div>

            {myJobs.length === 0 ? (
              <div className="p-12 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                <Briefcase className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-600">No active job listings</p>
                <p className="text-xs text-neutral-400 mt-1">Get started by posting your first available job opening.</p>
                <button
                  onClick={() => setActiveTab('post-job')}
                  className="mt-4 text-xs font-semibold px-3 py-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-850 cursor-pointer"
                >
                  Post a Job Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myJobs.map((job) => {
                  const jobAppsCount = applications.filter((app) => app.jobId === job.id).length;
                  return (
                    <div
                      key={job.id}
                      className="p-5 bg-white border border-neutral-200/80 rounded-xl hover:shadow-xs hover:border-neutral-300 transition-all space-y-4"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded-md">
                          {job.company}
                        </span>
                        <h4 className="text-base font-semibold text-neutral-900 mt-2">{job.title}</h4>
                      </div>

                      <div className="flex flex-wrap gap-y-2 gap-x-3 text-xs text-neutral-500">
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

                      <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
                        <span className="text-xs text-neutral-500 font-medium">
                          <span className="font-semibold text-neutral-800">{jobAppsCount}</span> applicants
                        </span>
                        <button
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setActiveTab('applicants');
                          }}
                          className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          View Applicants
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Applicants/Candidate Pipeline Tab */}
        {activeTab === 'applicants' && (
          <motion.div
            key="applicants"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Application Pipeline</h3>
                <p className="text-xs text-neutral-500">Review candidate files and update their status.</p>
              </div>

              {/* Job Selector Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium">Filter Position:</span>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="text-xs bg-white border border-neutral-300 rounded-lg p-1.5 focus:outline-none"
                >
                  <option value="All">All Positions</option>
                  {myJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} ({job.company})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="p-12 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
                <Users className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-600">No applications received yet</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {selectedJobId === 'All'
                    ? 'Candidates will appear here as soon as they submit applications for your listings.'
                    : 'No submissions found for the selected job posting.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 bg-white border border-neutral-200/85 rounded-xl flex flex-col lg:flex-row lg:items-start justify-between gap-6 hover:shadow-xs hover:border-neutral-300 transition-all"
                  >
                    {/* Candidate Details & Resume */}
                    <div className="space-y-4 flex-1">
                      <div className="flex gap-3 items-center">
                        {app.candidatePhoto ? (
                          <img
                            src={app.candidatePhoto}
                            alt={app.candidateName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 shrink-0">
                            <UserIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-neutral-900">{app.candidateName}</h4>
                            <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 rounded-full font-mono">
                              {app.candidateEmail}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 font-medium">
                            Applied for:{' '}
                            <span className="font-semibold text-neutral-700">
                              {app.jobTitle}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200/50">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                          Cover Letter Notes
                        </p>
                        <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
                          {app.coverLetter || 'No cover letter attached.'}
                        </p>
                      </div>

                      {/* File Details */}
                      {app.resume && (
                        <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100 max-w-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-neutral-500" />
                            <span className="text-xs font-semibold text-neutral-700 truncate max-w-[150px]">
                              {app.resumeName || 'Candidate-Resume.pdf'}
                            </span>
                          </div>
                          <a
                            href={app.resume}
                            download={app.resumeName || 'resume'}
                            className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5 bg-white px-2 py-0.5 rounded border border-indigo-200/80 cursor-pointer shadow-2xs"
                          >
                            Download Document
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Status & Action Buttons */}
                    <div className="lg:w-48 flex flex-col items-stretch lg:items-end justify-between gap-4 self-stretch border-t lg:border-t-0 border-neutral-100 pt-4 lg:pt-0 shrink-0">
                      <div className="text-right flex flex-row lg:flex-col justify-between items-center lg:items-end gap-1">
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                          Current Stage
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 w-full mt-auto">
                        <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider lg:text-right">
                          Update Candidate Stage
                        </span>
                        <div className="grid grid-cols-3 lg:grid-cols-1 gap-1.5">
                          <button
                            onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                            className="px-2 py-1 text-[11px] font-medium border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-all text-center cursor-pointer"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => onUpdateApplicationStatus(app.id, 'Hired')}
                            className="px-2 py-1 text-[11px] font-medium border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-all text-center cursor-pointer"
                          >
                            Hire
                          </button>
                          <button
                            onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')}
                            className="px-2 py-1 text-[11px] font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-all text-center cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Post Job Listing Tab */}
        {activeTab === 'post-job' && (
          <motion.div
            key="post-job"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-xl border border-neutral-200/80 p-6 shadow-xs max-w-3xl mx-auto text-left"
          >
            <h3 className="text-base font-semibold text-neutral-900 mb-1">Create a Job Position</h3>
            <p className="text-xs text-neutral-500 mb-6">
              Fill in the job details, requirements, and salary package to attract top talent.
            </p>

            {postSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold">Position published successfully! Redirecting...</span>
              </div>
            )}

            <form onSubmit={handlePostJobSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead React Developer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Salary Range</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $120k - $150k"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full text-xs border border-neutral-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Job Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Job['type'])}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain details of the role, team environment, and daily responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs border border-neutral-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              {/* Requirements Adder */}
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">
                  Position Requirements
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {requirements.length === 0 ? (
                    <span className="text-xs text-neutral-400">No requirements added yet. Add at least one.</span>
                  ) : (
                    requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1.5 text-xs bg-neutral-100 border border-neutral-200 text-neutral-700 pl-2.5 pr-1 py-0.5 rounded-full"
                      >
                        {req}
                        <button
                          type="button"
                          onClick={() => handleRemoveRequirement(req)}
                          className="w-4 h-4 rounded-full hover:bg-neutral-200/80 flex items-center justify-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 3+ years of React experience"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    className="flex-1 text-xs border border-neutral-300 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-3 bg-neutral-900 text-white rounded-lg flex items-center justify-center text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-850 text-white text-xs font-semibold rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  Publish Job Opening
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className="px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
