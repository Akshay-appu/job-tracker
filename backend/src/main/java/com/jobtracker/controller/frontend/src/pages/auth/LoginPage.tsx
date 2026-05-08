import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { extractErrorMessage } from '@/services/api';
import type { LoginRequest } from '@/types';

interface LoginFormFields {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>();

  const fromPath = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const onSubmit = async (data: LoginFormFields) => {
    const payload: LoginRequest = { email: data.email.trim(), password: data.password };
    try {
      await login(payload);
      toast.success('Welcome back!');
      navigate(fromPath, { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not sign you in.'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-7"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-faint">Welcome back</p>
        <h2 className="font-display text-3xl tracking-tight mt-2 text-balance">
          Sign in to <span className="font-serif italic">Trace</span>
        </h2>
        <p className="text-sm text-muted mt-1.5">
          New here?{' '}
          <Link to="/register" className="text-accent-600 dark:text-accent-400 underline-offset-4 hover:underline font-medium">
            Create an account
          </Link>
          .
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <Input
          type="email"
          autoComplete="email"
          label="Email"
          placeholder="you@company.com"
          leftIcon={<Mail className="size-4" />}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
          error={errors.email?.message}
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          label="Password"
          placeholder="••••••••"
          leftIcon={<Lock className="size-4" />}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="rounded-md p-1.5 text-faint hover:text-[rgb(var(--text))] focus-ring"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          loading={isSubmitting}
          rightIcon={<ArrowRight className="size-4" />}
          className="w-full mt-2"
          size="lg"
        >
          Sign in
        </Button>
      </form>

      <p className="text-xs text-faint text-center">
        Protected by JWT · Backend at{' '}
        <code className="font-mono text-[11px]">{import.meta.env.VITE_BACKEND_URL ?? '/api'}</code>
      </p>
    </motion.div>
  );
}
