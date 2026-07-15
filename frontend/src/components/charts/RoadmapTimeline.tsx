"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  completed?: boolean;
}

export default function RoadmapTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4"
        >
          <div className="flex flex-col items-center">
            {event.completed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            ) : (
              <Circle className="h-6 w-6 text-slate-500" />
            )}
            {index !== events.length - 1 && (
              <div className="w-0.5 h-full bg-slate-700 my-2" />
            )}
          </div>
          <div className="pb-6">
            <h4 className="text-lg font-semibold text-slate-200">Year {event.year}: {event.title}</h4>
            <p className="text-sm text-slate-400 mt-1">{event.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
