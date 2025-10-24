import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from './ui/Dialog';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectItem } from './ui/Select';
import { Did } from '../types';
import { t } from '../lib/i18n';

interface AddDidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Changed return type to Promise<void> to match the implementation in the parent component.
  onAddDid: (phoneNumber: string, country: Did['country']) => Promise<void>;
}

export const AddDidDialog: React.FC<AddDidDialogProps> = ({ isOpen, onClose, onAddDid }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState<Did['country']>('MX');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!phoneNumber.trim()) return;
    setIsSaving(true);
    await onAddDid(phoneNumber, country);
    setIsSaving(false);
    setPhoneNumber('');
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.didsPage.addModal.title}</DialogTitle>
          <DialogDescription>
            {t.didsPage.addModal.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              {t.didsPage.addModal.phoneNumber}
            </Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t.didsPage.addModal.phoneNumberPlaceholder}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              {t.didsPage.addModal.country}
            </Label>
            {/* FIX: Use native select with onChange and correct structure */}
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value as Did['country'])}
              className="col-span-3"
            >
              <SelectItem value="MX">México (MX)</SelectItem>
              <SelectItem value="US">United States (US)</SelectItem>
              <SelectItem value="GB">United Kingdom (GB)</SelectItem>
              <SelectItem value="CO">Colombia (CO)</SelectItem>
              <SelectItem value="ES">España (ES)</SelectItem>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
             <Button type="button" variant="secondary">{t.didsPage.addModal.cancel}</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : t.didsPage.addModal.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};