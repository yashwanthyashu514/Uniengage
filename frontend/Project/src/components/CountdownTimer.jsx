import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ eventDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(eventDate).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [eventDate]);

    return (
        <div className="flex gap-2 items-center justify-center mt-3">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <motion.div
                    key={unit}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center bg-white/10 rounded-lg px-2 py-1 min-w-[50px]"
                >
                    <span className="text-white font-bold text-lg">{value}</span>
                    <span className="text-white/60 text-xs capitalize">{unit}</span>
                </motion.div>
            ))}
        </div>
    );
};

export default CountdownTimer;
