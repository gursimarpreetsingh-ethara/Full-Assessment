import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import { registerAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('member');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasError(false);
    
    try {
      const data = await registerAPI(name, email, password);
      login(data.token, data.user);
      addToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (error) {
      setHasError(true);
      const errors = error.response?.data?.errors;
      const message = errors ? errors.map(e => e.message).join(', ') : (error.response?.data?.message || 'Failed to register');
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={hasError ? 'animate-shake' : ''}>
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Join Team Task Manager to manage your team's work</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2 text-gray-700">Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 text-sm font-medium rounded-md border transition-all ${role === 'admin' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`py-2 text-sm font-medium rounded-md border transition-all ${role === 'member' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                Team Member
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pr-10"
                placeholder="At least 6 characters"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-4" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>
        
        <div className="mt-6 text-center lg:text-left text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
