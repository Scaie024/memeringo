import React from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { PlusIcon } from './icons/Icons';
import { t } from '../lib/i18n';

interface DidsToolbarProps {
  filter: string;
  setFilter: (value: string) => void;
  onAddDidClick: () => void;
}

export const DidsToolbar: React.FC<DidsToolbarProps> = ({ filter, setFilter, onAddDidClick }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t.didsPage.filterPlaceholder}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="h-10 w-[250px]"
        />
      </div>
      <Button onClick={onAddDidClick}>
        <PlusIcon className="mr-2 h-4 w-4" />
        {t.didsPage.addDid}
      </Button>
    </div>
  );
};
