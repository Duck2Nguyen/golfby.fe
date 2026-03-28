import { MapPin } from 'lucide-react';

interface ContactSectionProps {
  email: string;
  phone: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export default function ContactSection({ email, phone, onEmailChange, onPhoneChange }: ContactSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-[16px] text-foreground font-700">Thông Tin Liên Hệ</h2>
      </div>
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
        <input
          type="tel"
          placeholder="Số điện thoại"
          value={phone}
          onChange={e => onPhoneChange(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-border bg-[#fafafa] text-[14px] outline-none focus:border-primary focus:bg-white"
        />
      </div>
    </section>
  );
}
