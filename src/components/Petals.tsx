import { useEffect, useState } from "react";

export function Petals({ count = 10 }: { count?: number }) {
  const [petals, setPetals] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    // Generate petal data using React state
    const newPetals = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
    }));
    setPetals(newPetals);
  }, [count]);

  return (
    <>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal fixed pointer-events-none z-0"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
          }}
        />
      ))}
    </>
  );
}
