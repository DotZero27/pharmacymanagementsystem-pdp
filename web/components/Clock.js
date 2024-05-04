'use client'
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react'

const Clock = () => {
    const getDayStatus = () => {
        const now = new Date();
        const hours = now.getHours();

        if (hours >= 5 && hours < 12) {
            return 'Morning';
        } else if (hours >= 12 && hours < 18) {
            return 'Evening';
        } else {
            return 'Night';
        }

    }

    const [currentTime, setCurrentTime] = useState('');
    const [isMounted, setIsMounted] = useState(false)
    const [status, setStatus] = useState(getDayStatus())

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true)
        }
    }, [])


    useEffect(() => {
        if (isMounted) {
            const intervalId = setInterval(() => {

                getDayStatus()
                setCurrentTime(getFormattedTime);
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [isMounted]);

    function getFormattedTime() {
        const now = new Date()

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }

    function getFormattedDate() {
        const now = new Date();

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return `${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    }

    return (
        <div className='flex flex-col items-end justify-center'>
            <div className='flex gap-2 items-center justify-center'>
                <div className={cn('w-2 h-2 p-2 rounded-full', {
                    "bg-yellow-400": status === "Morning",
                    "bg-orange-400": status === "Evening",
                    "bg-gray-700": status === "Night",
                })} />
                <span>
                    {status}
                </span>
            </div>
            <div className='flex gap-2 items-center'>
                <span className=''>{getFormattedDate()}</span>
                <div className='animate-pulse bg-yellow-400 w-1 h-1 rounded-full' />
                <p>{currentTime || getFormattedTime()}</p>
            </div>
        </div>
    );
};

export default Clock;
