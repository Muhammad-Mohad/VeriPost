'use client';

import { Field, Input } from '@/components/ui/Input';
import { KeyRound } from 'lucide-react';

interface TokenFieldProps {
  value: string;
  onChange: (v: string) => void;
}

export const TokenField = ({ value, onChange }: TokenFieldProps) => (
  <Field label="Admin token" hint="Required only if VERIPOST_ADMIN_TOKEN is set on the backend.">
    <Input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste admin token (optional)"
      leftIcon={<KeyRound size={14} />}
    />
  </Field>
);
