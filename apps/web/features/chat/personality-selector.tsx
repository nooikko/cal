'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Personality } from '@prisma/client';

interface PersonalitySelectorProps {
  /** The controlled value from React Hook Form */
  value: string;
  /** Called when the user picks a new value */
  onChange: (newVal: string) => void;
  /** The list of personalities to show */
  personalities: Pick<Personality, 'id' | 'name'>[];
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({ value, onChange, personalities }) => {
  const [open, setOpen] = React.useState(false);

  // Find the label for the current value
  const currentLabel = React.useMemo(() => {
    return personalities.find((p) => p.id === value)?.name || '';
  }, [value, personalities]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
        <Button variant='outline' role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
          {currentLabel || 'Select personality...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search personalities...' />
          <CommandList>
            <CommandEmpty>No personalities found.</CommandEmpty>
            <CommandGroup>
              {personalities.map((personality) => (
                <CommandItem
                  key={personality.id}
                  value={personality.id}
                  onSelect={(currentValue) => {
                    // If the user selects the same value again, do you want to clear it or keep it?
                    // This example keeps it but you could do onChange(currentValue === value ? '' : currentValue)
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === personality.id ? 'opacity-100' : 'opacity-0')} />
                  {personality.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
