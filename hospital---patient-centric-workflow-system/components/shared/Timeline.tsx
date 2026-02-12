
import React from 'react';
import { TimelineEvent, Urgency, UserRole } from '../../types';

interface TimelineProps {
  events: TimelineEvent[];
  onViewReport?: (event: TimelineEvent) => void;
  currentUserRole?: UserRole;
}

const Timeline: React.FC<TimelineProps> = ({ events, onViewReport, currentUserRole }) => {
  if (events.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
        No clinical events recorded for this patient yet.
      </div>
    );
  }

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'vitals':
        return (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'prescription':
        return (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-1.562 1.488l-4.535.907a2 2 0 01-2.261-1.282l-1.01-3.03a2 2 0 01.353-1.878l2.446-3.263a2 2 0 00.32-2.129L5.93 5.432a2 2 0 00-1.745-1.164H3.43a2 2 0 00-2 2V12a10 10 0 0010 10h1.57a2 2 0 002-1.22l1.284-3.851a2 2 0 011.647-1.373l3.528-.441a2 2 0 001.769-1.987V15.7a2 2 0 00-.572-1.414z" />
          </svg>
        );
      case 'diagnostic':
        return (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
      {events.map((event, idx) => (
        <div key={event.id} className="relative pl-8 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${idx * 50}ms` }}>
          <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
            event.urgency === Urgency.CRITICAL ? 'bg-red-500' : 
            event.urgency === Urgency.HIGH ? 'bg-amber-500' : 
            event.type === 'vitals' ? 'bg-teal-500' : 
            event.type === 'diagnostic' ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {getEventIcon(event.type)}
          </div>
          <div className="flex justify-between items-start mb-1">
            <h4 className={`font-bold ${event.type === 'vitals' ? 'text-teal-700' : 'text-slate-800'}`}>
              {event.title}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <p className={`text-sm ${event.type === 'vitals' ? 'text-teal-900 bg-teal-50/50 p-2 rounded-lg border border-teal-100/50' : 'text-slate-600'}`}>
              {event.description}
            </p>
            
            {/* Show "View Report" button for doctors only if report exists */}
            {event.type === 'diagnostic' && event.report_url && currentUserRole === UserRole.DOCTOR && onViewReport && (
              <div>
                <button 
                  onClick={() => onViewReport(event)}
                  className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" /></svg>
                  View Full Report
                </button>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-tight">
              Action by: {event.actor}
            </span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className={`text-[10px] font-bold uppercase ${event.type === 'vitals' ? 'text-teal-600' : 'text-blue-500'}`}>
              {event.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
