import { useState } from 'react';
import { Job, Application, User, UserRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Briefcase,
  FileText,
  Trash2,
  ShieldCheck,
  Search,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Mail
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  users: User[];
  jobs: Job[];
  applications: Application[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onDeleteUser: (userId: string) => void;
  onDeleteJob: (jobId: string) => void;
}

export default function AdminDashboard({
  currentUser,
  users,
  jobs,
  applications,
  onUpdateUserRole,
  onDeleteUser,
  onDeleteJob,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'jobs'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  // Stats calculation
  const totalUsersCount = users.length;
  const recruitersCount = users.filter((u) => u.role === 'Recruiter').length;
  const candidatesCount = users.filter((u) => u.role === 'Candidate').length;
  const totalJobsCount = jobs.length;
  const totalAppsCount = applications.length;

  const filteredUsers = users.filter((u) => {
    const searchLower = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      u.role.toLowerCase().includes(searchLower)
    );
  });

  const filteredJobs = jobs.filter((j) => {
    const searchLower = jobSearch.toLowerCase();
    return (
      j.title.toLowerCase().includes(searchLower) ||
      j.company.toLowerCase().includes(searchLower) ||
      j.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 text-left">
      {/* Platform Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Total Members
            </p>
            <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{totalUsersCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Candidates / Recs
            </p>
            <h3 className="text-sm font-bold text-neutral-900 mt-1">
              {candidatesCount} <span className="text-neutral-300 font-normal">/</span> {recruitersCount}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Active Listings
            </p>
            <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{totalJobsCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Applications
            </p>
            <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{totalAppsCount}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Manage Users
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
            activeTab === 'jobs'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Manage Job Postings
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Manage Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-neutral-200/80">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search user name, email, or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Users list */}
            <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-4">User Details</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Joined Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {u.profilePhoto ? (
                              <img
                                src={u.profilePhoto}
                                alt={u.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 font-bold font-mono">
                                {u.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-neutral-900 flex items-center gap-1">
                                {u.name}
                                {u.id === currentUser.id && (
                                  <span className="text-[9px] bg-neutral-900 text-white px-1.5 py-0.2 rounded font-normal font-mono">
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="text-neutral-400 font-mono text-[10px] mt-0.5">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {u.id === currentUser.id ? (
                            <span className="inline-flex items-center gap-1 font-mono text-neutral-800 font-bold">
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                              System Admin
                            </span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                              className="bg-white border border-neutral-300 rounded px-2 py-1 focus:outline-none font-medium"
                            >
                              <option value="Candidate">Candidate</option>
                              <option value="Recruiter">Recruiter</option>
                              <option value="Admin">Admin</option>
                            </select>
                          )}
                        </td>
                        <td className="p-4 font-mono text-neutral-400">
                          {new Date(u.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            disabled={u.id === currentUser.id}
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user "${u.name}"? This action cannot be undone.`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className={`p-1.5 rounded hover:bg-neutral-100 transition-colors text-right cursor-pointer ${
                              u.id === currentUser.id ? 'text-neutral-300' : 'text-neutral-500 hover:text-rose-600'
                            }`}
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Manage Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div
            key="jobs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-neutral-200/80">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search jobs, company, location..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            {/* Jobs list */}
            <div className="bg-white rounded-xl border border-neutral-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Position details</th>
                      <th className="p-4">Compensation</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Posted By</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-neutral-400 italic">
                          No job positions found.
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-bold text-neutral-900">{job.title}</p>
                              <p className="text-neutral-500 mt-0.5">
                                <span className="font-semibold text-neutral-700">{job.company}</span> • {job.location}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-neutral-600">{job.salary}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full border border-neutral-200 text-neutral-700 font-medium">
                              {job.type}
                            </span>
                          </td>
                          <td className="p-4 text-neutral-500 font-medium">{job.recruiterName}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove job post "${job.title}" by "${job.company}"?`)) {
                                  onDeleteJob(job.id);
                                }
                              }}
                              className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
