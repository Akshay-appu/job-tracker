import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { extractErrorMessage } from '@/services/api';
import type { RegisterRequest } from '@/types';

interface RegisterFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>();

  const passwordValue = watch('password', '');

  const passwordStrength = (() => {
    if (!passwordValue) return { score: 0, label: '' };
    let score = 0;
    if (passwordValue.length >= 8) score += 1;
    if (/[A-Z]/.test(passwordValue)) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1;
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return { score, label: labels[Math.min(score, labels.length) - 1] || 'Weak' };
  })();

  const onSubmit = async (data: RegisterFields) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    const payload: RegisterRequest = {
      username: data.username.trim(),
      email: data.email.trim(),
      password: data.password,
    };
    try {
      await doRegister(payload);
      toast.success('Account created — welcome aboard!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not create your account.'));
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
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-faint">Create account</p>
        <h2 className="font-display text-3xl tracking-tight mt-2 text-balance">
          Start tracking <span className="font-serif italic">smarter</span>
        </h2>
        <p className="text-sm text-muted mt-1.5">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-600 dark:text-accent-400 underline-offset-4 hover:underline font-medium">
            Sign in
          </Link>
          .
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <Input
          autoComplete="username"
          label="Username"
          placeholder="jane.doe"
          leftIcon={<User className="size-4" />}
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'At least 3 characters' },
          })}
          error={errors.username?.message}
        />
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
          autoComplete="new-password"
          label="Password"
          placeholder="At least 8 characters"
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
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
          error={errors.password?.message}
        />
        {passwordValue && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < passwordStrength.score ? 'bg-accent-400' : 'bg-[rgb(var(--border))]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-faint w-12 text-right">{passwordStrength.label}</span>
          </div>
        )}
        <Input
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          label="Confirm password"
          placeholder="Re-enter password"
          leftIcon={<Lock className="size-4" />}
          {...register('confirmPassword', { required: 'Please confirm your password' })}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          loading={isSubmitting}
          rightIcon={<ArrowRight className="size-4" />}
          className="w-full mt-2"
          size="lg"
        >
          Create account
        </Button>
      </form>

      <p className="text-xs text-faint text-center">
        By continuing you agree to handle your data responsibly. Trace stores no cookies — JWT is in localStorage.
      </p>
    </motion.div>
  );
}
