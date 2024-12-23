import { Skeleton } from '@/components/ui/skeleton';
import type { BeautifulMentionsMenuItemProps, BeautifulMentionsMenuProps } from 'lexical-beautiful-mentions';
import { forwardRef, useEffect, useState } from 'react';

export const CustomMentionMenu = forwardRef<HTMLUListElement, BeautifulMentionsMenuProps & { inputRef?: HTMLDivElement | null }>(
  ({ loading, inputRef, ...props }, ref) => {
    const [menuStyles, setMenuStyles] = useState<{ width?: string; left?: string; top?: string }>({});

    useEffect(() => {
      if (inputRef) {
        const inputRect = inputRef.getBoundingClientRect();
        setMenuStyles({
          width: `${inputRect.width}px`, // Match input width
          left: `${inputRect.left}px`, // Align with input's left
          top: `${inputRect.bottom}px`, // Position below the input
        });
      }
    }, [inputRef]);

    if (loading) {
      return (
        <ul
          ref={ref}
          style={{
            position: 'fixed', // Use fixed to avoid offsets from relative/absolute parents
            zIndex: 1000,
            ...menuStyles, // Dynamically set styles
          }}
          className='bg-white border border-gray-200 rounded shadow-md p-2'
          {...props}
        >
          <Skeleton className='w-full h-10' />
        </ul>
      );
    }

    return (
      <ul
        ref={ref}
        style={{
          position: 'fixed', // Use fixed to avoid offsets from relative/absolute parents
          zIndex: 1000,
          ...menuStyles, // Dynamically set styles
        }}
        className='bg-white border border-gray-200 rounded shadow-md p-2'
        {...props}
      />
    );
  },
);

export const CustomMenuItem = forwardRef<HTMLLIElement, BeautifulMentionsMenuItemProps>(({ selected, item, ...props }, ref) => {
  // Destructure `itemValue` to prevent it from being passed to the `<li>`
  const { itemValue, ...rest } = props;
  console.log('🚀 ~ CustomMenuItem ~ itemValue:', itemValue);

  return (
    <li
      ref={ref}
      className={`custom-menu-item px-2 py-1 cursor-pointer ${selected ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-800'}`}
      {...rest} // Pass only valid props to the `<li>`
      value={itemValue}
    >
      {itemValue}
    </li>
  );
});
