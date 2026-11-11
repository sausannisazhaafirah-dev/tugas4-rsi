import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { inputClass } from '../lib/styles';

export function Spinner({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

const alertTone = {
  error: { box: 'border-red-200 bg-red-50 text-red-800', Icon: AlertCircle },
  success: { box: 'border-green-200 bg-green-50 text-green-800', Icon: CheckCircle2 },
  info: { box: 'border-line bg-brand-soft text-brand-dark', Icon: Info },
};

export function Alert({ tone, children }: { tone: keyof typeof alertTone; children: ReactNode }) {
  const { box, Icon } = alertTone[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${box}`}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  multiline?: boolean;
}

// Input + label + pesan error validasi dari backend tepat di bawahnya.
export function Field({ label, name, value, onChange, error, type = 'text', placeholder, autoComplete, multiline }: FieldProps) {
  const border = error ? 'border-red-400' : 'border-line';
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium text-muted">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${border} resize-y`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${border}`}
        />
      )}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}