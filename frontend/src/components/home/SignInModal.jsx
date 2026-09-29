import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  KeyRound,
  Mail,
  Badge,
  UserCheck,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { registerDetective, loginDetective } from '../../utils/profileStorage';

export const SignInModal = ({ isOpen, onClose, profile, onSignIn }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // Log in form state
  const [loginBadgeId, setLoginBadgeId] = useState(profile?.badgeNumber || 'DT-8094');
  const [loginPin, setLoginPin] = useState('');

  // Register form state
  const [regMail, setRegMail] = useState('');
  const [regBadgeId, setRegBadgeId] = useState('');
  const [regPin, setRegPin] = useState('');
  const [regConfirmPin, setRegConfirmPin] = useState('');

  // Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      if (profile?.badgeNumber) {
        setLoginBadgeId(profile.badgeNumber);
      }
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  // Handle Log In ("Start Your Shift, Detective")
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginBadgeId.trim()) {
      setErrorMessage('Please enter your Detective Badge ID.');
      return;
    }
    if (!loginPin.trim()) {
      setErrorMessage('Please enter your Security PIN Code.');
      return;
    }

    const res = loginDetective({
      badgeNumber: loginBadgeId,
      pin: loginPin,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials.');
      return;
    }

    setSuccessMessage(`Shift Started! Welcome back, Detective ${res.profile.lastName || res.profile.badgeNumber}.`);
    onSignIn(res.profile);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // Handle Register ("Register as a Detective")
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regMail.trim() || !regMail.includes('@')) {
      setErrorMessage('Please enter a valid department email address.');
      return;
    }
    if (!regBadgeId.trim()) {
      setErrorMessage('Please assign a Detective Badge ID (e.g. DT-5021).');
      return;
    }
    if (!regPin.trim() || regPin.length < 4) {
      setErrorMessage('Security PIN Code must be at least 4 digits/characters.');
      return;
    }
    if (regPin !== regConfirmPin) {
      setErrorMessage('Security PIN Code and Confirm PIN Code do not match.');
      return;
    }

    const res = registerDetective({
      email: regMail,
      badgeNumber: regBadgeId,
      pin: regPin,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
      return;
    }

    setSuccessMessage(`Commission Confirmed! Registered as Badge ${res.profile.badgeNumber}.`);
    onSignIn(res.profile);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSignOut = () => {
    const updated = { ...profile, isSignedIn: false };
    onSignIn(updated);
    setSuccessMessage('Shift Ended. Terminal Locked.');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel w-full max-w-lg rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-sm font-bold uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Agency Terminal Authentication</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Start Your Shift (Log In)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as a Detective</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/70 text-rose-200 text-xs font-mono flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/70 text-emerald-200 text-xs font-mono flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOG IN ("Start Your Shift, Detective") */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="p-6 flex flex-col gap-4">
              <div className="mb-1">
                <h3 className="text-sm font-mono font-bold uppercase text-slate-100 tracking-wide">
                  Start Your Shift, Detective
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Verify your active badge credentials to access forensic casework.
                </p>
              </div>

              {/* Detective Badge ID */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Detective Badge ID:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginBadgeId}
                    onChange={(e) => setLoginBadgeId(e.target.value)}
                    placeholder="e.g. DT-8094"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Security PIN Code */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Security PIN Code:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="Enter Security PIN Code"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 font-mono text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  * Default demo PIN for badge DT-8094 is 1234
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] cursor-pointer flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Start Shift & Access Docket</span>
              </button>

              {/* Auxiliary actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  New to Division? Register as a Detective
                </button>

                {profile?.isSignedIn && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>End Shift</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER ("Register as a Detective") */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="p-6 flex flex-col gap-4">
              <div className="mb-1">
                <h3 className="text-sm font-mono font-bold uppercase text-amber-300 tracking-wide">
                  Register as a Detective
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Enroll into the Metropolitan Homicide Division with your official credentials.
                </p>
              </div>

              {/* Mail */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Mail (Department Email):
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regMail}
                    onChange={(e) => setRegMail(e.target.value)}
                    placeholder="detective.name@police.dept"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Detective Badge ID */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1">
                  Detective Badge ID:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regBadgeId}
                    onChange={(e) => setRegBadgeId(e.target.value)}
                    placeholder="e.g. DT-3042"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Security PIN Code & Confirm PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1">
                    Security PIN Code:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={regPin}
                      onChange={(e) => setRegPin(e.target.value)}
                      placeholder="Min 4 digits"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none transition-colors"
                    />
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1">
                    Confirm Security PIN:
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={regConfirmPin}
                      onChange={(e) => setRegConfirmPin(e.target.value)}
                      placeholder="Confirm PIN"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 font-mono text-sm focus:border-amber-400 focus:outline-none transition-colors"
                    />
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Detective Badge</span>
              </button>

              <div className="pt-2 border-t border-slate-800/80 text-center text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
                >
                  Already authorized? Start your shift, Detective
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
