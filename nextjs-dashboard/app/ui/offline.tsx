'use client'
import { useEffect, useState } from 'react';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const OfflineDetector: React.FC = () => {
 const [isOffline, setIsOffline] = useState<boolean>(false);
 useEffect(() => {
   const handleOfflineStatus = () => {
     setIsOffline(!navigator.onLine);
   };
   handleOfflineStatus(); // Check initial status
   window.addEventListener('online', handleOfflineStatus);
   window.addEventListener('offline', handleOfflineStatus);
   return () => {
     window.removeEventListener('online', handleOfflineStatus);
     window.removeEventListener('offline', handleOfflineStatus);
   };
 }, []);
 return (
<div>
<span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-red-100 text-red-500': isOffline === true,
          'bg-green-500 text-white': isOffline === false,
        },
      )}
    >
     {isOffline ? (
    <>
        offline
        <ClockIcon className="ml-1 w-4 text-gray-500" />
    </>
     ) : (
    <>
        online
        <CheckIcon className="ml-1 w-4 text-white" />
    </>
     )}
     </span>
</div>
 );
};
export default OfflineDetector;




