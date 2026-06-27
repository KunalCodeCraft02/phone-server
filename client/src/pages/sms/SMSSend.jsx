import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, X } from 'lucide-react';
import { useSendSMS } from '../../hooks/useSMS';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const schema = z.object({
  receiver: z.string().min(1, 'Phone number is required'),
  message: z.string().min(1, 'Message is required').max(1600, 'Message too long'),
});

export default function SMSSend({ isOpen, onClose }) {
  const sendMutation = useSendSMS();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await sendMutation.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send SMS">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Receiver"
          placeholder="+1 234 567 8900"
          error={errors.receiver?.message}
          {...register('receiver')}
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Message
          </label>
          <textarea
            {...register('message')}
            rows={4}
            placeholder="Type your message..."
            className="glass-input w-full resize-none"
          />
          {errors.message && (
            <p className="mt-1.5 text-sm text-red-400">{errors.message.message}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={sendMutation.isPending}>
            <Send className="h-4 w-4" />
            Send SMS
          </Button>
        </div>
      </form>
    </Modal>
  );
}
