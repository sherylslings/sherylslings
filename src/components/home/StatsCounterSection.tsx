import { useEffect, useState } from 'react';
import { useHomeStats } from '@/hooks/useHomeStats';

const useCountUp = (target: number, duration = 900) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

const Counter = ({ value, label }: { value: number; label: string }) => {
  const n = useCountUp(value);
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <p className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tabular-nums">
        {n}
      </p>
      <p className="mt-2 text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
};

export const StatsCounterSection = () => {
  const { data } = useHomeStats();
  const stats = data ?? { carriers_total: 0, carriers_available: 0, times_rented: 0 };

  return (
    <section className="bg-secondary/50 border-y border-border">
      <div className="container">
        <div className="grid grid-cols-3 divide-x divide-border">
          <Counter value={stats.carriers_total} label="Carriers" />
          <Counter value={stats.carriers_available} label="Available Now" />
          <Counter value={stats.times_rented} label="Times Rented" />
        </div>
      </div>
    </section>
  );
};
