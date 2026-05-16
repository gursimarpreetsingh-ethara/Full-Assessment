import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';
import { loginAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
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
      const data = await loginAPI(email, password);
      login(data.token, data.user);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (error) {
      setHasError(true);
      addToast(error.response?.data?.message || 'Failed to login', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={hasError ? 'animate-shake' : ''}>
        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-[var(--text-muted)] text-sm">Enter your credentials to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Login As</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 text-sm font-medium rounded-md border transition-all ${role === 'admin' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'}`}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`py-2 text-sm font-medium rounded-md border transition-all ${role === 'member' ? 'bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'}`}
              >
                Team Member
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">Email Address</label>
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
            <div className="flex justify-between mb-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Password</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--text-muted)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <Button type="submit" variant="primary" className="w-full py-2.5 mt-2" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center lg:text-left text-sm text-[var(--text-muted)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Create one
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
