// app/dashboard/calendar/page.tsx
"use client";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '@/context/AuthContext';

const localizer = momentLocalizer(moment);
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TeacherCalendar() {
  const { events } = useCalendarData(); // Hook مخصص لجلب البيانات من الـ API

  return (
    <div className="h-[80vh] p-4 bg-white rounded-2xl shadow-sm border">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        eventPropGetter={(event) => ({
            style: {
                backgroundColor: event.type === 'quiz' ? '#ef4444' : '#3b82f6',
                borderRadius: '8px',
                border: 'none'
            }
        })}
      />
    </div>
  )}