import { Pencil, Trash2 } from 'lucide-react';

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  country: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const fullName = `${address.firstName} ${address.lastName}`;

  return (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Header: Name + Actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] text-foreground font-700">{fullName}</span>
          {address.isDefault && (
            <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[11px] text-primary font-600">
              Mặc Định
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
            title="Chỉnh sửa"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-all duration-200"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-0.5 text-[14px] text-muted-foreground flex-1">
        {address.company && <p>{address.company}</p>}
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>{address.city}</p>
        <p>{address.zipCode}</p>
        <p>{address.country}</p>
        <p>{address.phone}</p>
      </div>
    </div>
  );
}
