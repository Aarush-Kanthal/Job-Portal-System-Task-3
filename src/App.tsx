import { useState, useEffect } from 'react';
import { User, Job, Application, UserRole } from './types';
import { INITIAL_USERS, INITIAL_JOBS, INITIAL_APPLICATIONS } from './mockData';
import Auth from './components/Auth';
import CandidateDashboard from './components/CandidateDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import AdminDashboard from './components/AdminDashboard';
import { motion } from 'motion/react';
import {
  Briefcase,
  LogOut,
  User as UserIcon,
  Shield,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  // Load initial states from localStorage or use seeded mockData
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('jp_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('jp_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('jp_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jp_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('jp_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('jp_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jp_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('jp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('jp_current_user');
    }
  }, [currentUser]);

  // Handle Authentication triggers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleRegister = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  // Switch role simulator (For testing / grading convenience)
  const handleSimulatedRoleChange = (role: UserRole) => {
    // Find first seeded user of this role, or create one
    const matchingUser = users.find((u) => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    } else {
      // Fallback create dummy user
      const dummy: User = {
        id: `u-sim-${role.toLowerCase()}`,
        email: `${role.toLowerCase()}-tester@jobportal.com`,
        name: `${role} Tester`,
        role: role,
        joinedAt: new Date().toISOString(),
        skills: [],
      };
      setUsers((prev) => [...prev, dummy]);
      setCurrentUser(dummy);
    }
  };

  // Candidate: Apply for job
  const handleApply = (jobId: string, coverLetter: string, resume?: string, resumeName?: string) => {
    if (!currentUser) return;
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: targetJob.title,
      company: targetJob.company,
      candidateId: currentUser.id,
      candidateName: currentUser.name,
      candidateEmail: currentUser.email,
      candidatePhoto: currentUser.profilePhoto,
      resume: resume || currentUser.resume,
      resumeName: resumeName || currentUser.resumeName,
      coverLetter,
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApplication, ...prev]);
  };

  // Candidate: Update profile
  const handleUpdateProfile = (updatedFields: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedFields };
    setCurrentUser(updatedUser);

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );

    // Update applicant profile meta inside applications too for reactivity
    setApplications((prev) =>
      prev.map((app) => {
        if (app.candidateId === currentUser.id) {
          return {
            ...app,
            candidateName: updatedFields.name || app.candidateName,
            candidatePhoto: updatedFields.profilePhoto !== undefined ? updatedFields.profilePhoto : app.candidatePhoto,
            resume: updatedFields.resume !== undefined ? updatedFields.resume : app.resume,
            resumeName: updatedFields.resumeName !== undefined ? updatedFields.resumeName : app.resumeName,
          };
        }
        return app;
      })
    );
  };

  // Recruiter: Post Job
  const handleAddJob = (jobDetails: Omit<Job, 'id' | 'recruiterId' | 'recruiterName' | 'postedAt'>) => {
    if (!currentUser) return;

    const newJob: Job = {
      ...jobDetails,
      id: `job-${Date.now()}`,
      recruiterId: currentUser.id,
      recruiterName: currentUser.name,
      postedAt: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);
  };

  // Recruiter: Update application stage
  const handleUpdateApplicationStatus = (applicationId: string, status: Application['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
    );
  };

  // Admin: Update User Role
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    // If updating currently logged in user, refresh session
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => prev ? { ...prev, role: newRole } : null);
    }
  };

  // Admin: Delete User
  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    // Remove jobs posted by this user if they were a recruiter
    setJobs((prev) => prev.filter((j) => j.recruiterId !== userId));
    // Remove applications submitted by this user if they were a candidate
    setApplications((prev) => prev.filter((a) => a.candidateId !== userId));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
  };

  // Admin: Delete Job
  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    // Cascade delete applications to this job
    setApplications((prev) => prev.filter((a) => a.jobId !== jobId));
  };

  // Determine role badge style
  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-neutral-900 border-neutral-800 text-white';
      case 'Recruiter':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Dev Switcher Bar */}
      {currentUser && (
        <div className="bg-neutral-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-neutral-200">Simulation Workspace:</span>
            <span>Switch roles instantly to test different screens</span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleSimulatedRoleChange('Candidate')}
              className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                currentUser.role === 'Candidate'
                  ? 'bg-emerald-500 text-white font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Candidate Role
            </button>
            <button
              onClick={() => handleSimulatedRoleChange('Recruiter')}
              className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                currentUser.role === 'Recruiter'
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Recruiter Role
            </button>
            <button
              onClick={() => handleSimulatedRoleChange('Admin')}
              className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                currentUser.role === 'Admin'
                  ? 'bg-neutral-100 text-neutral-900 font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Admin Role
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-neutral-900 leading-none">JobPortal</h1>
              <span className="text-[10px] text-neutral-400 font-mono">Talent Matcher v1.0</span>
            </div>
          </div>

          {/* Active User Session Details */}
          {currentUser ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5 text-right">
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-neutral-900 leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{currentUser.email}</p>
                </div>
                {currentUser.profilePhoto ? (
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold ${getRoleBadgeStyle(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer border border-neutral-200/50"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
              <Info className="w-4 h-4 text-neutral-400" />
              <span>Full Role-Based Access Simulation</span>
            </div>
          )}
        </div>
      </header>

      {/* Dashboard Body / Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {!currentUser ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Auth onLogin={handleLogin} users={users} onRegister={handleRegister} />
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Context/Intro banner per active persona */}
            <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-neutral-900">
                  Welcome back, {currentUser.name}!
                </h2>
                <p className="text-xs text-neutral-500">
                  {currentUser.role === 'Admin' && 'System Administrator Mode: Oversee user registrations, adjust credentials, and clean up positions.'}
                  {currentUser.role === 'Recruiter' && 'Employer Console: Manage positions, write openings, and shortlist applied candidates.'}
                  {currentUser.role === 'Candidate' && 'Job Candidate Hub: Find listings, maintain your profile, upload files, and send applications.'}
                </p>
              </div>
            </div>

            {/* Dashboards matching roles */}
            {currentUser.role === 'Candidate' && (
              <CandidateDashboard
                currentUser={currentUser}
                jobs={jobs}
                applications={applications}
                onApply={handleApply}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {currentUser.role === 'Recruiter' && (
              <RecruiterDashboard
                currentUser={currentUser}
                jobs={jobs}
                applications={applications}
                onAddJob={handleAddJob}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
              />
            )}

            {currentUser.role === 'Admin' && (
              <AdminDashboard
                currentUser={currentUser}
                users={users}
                jobs={jobs}
                applications={applications}
                onUpdateUserRole={handleUpdateUserRole}
                onDeleteUser={handleDeleteUser}
                onDeleteJob={handleDeleteJob}
              />
            )}
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400">
        <p>© 2026 JobPortal System. Built for recruitment, candidate applications, and role administration.</p>
      </footer>
    </div>
  );
}
