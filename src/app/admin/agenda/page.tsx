'use client';

import { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Card from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { useRouter } from 'next/navigation';

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    backgroundColor?: string;
    borderColor?: string;
    extendedProps?: {
        pet: string;
        tutor: string;
        status: string;
        services: string;
    };
}

interface Appointment {
    _id: string;
    patientId: { name: string; tutorName: string };
    scheduledDate: string;
    status: string;
    services: { name: string; duration: number }[];
}

export default function AdminAgenda() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Fetch appointments for the next 6 months to optimize request size
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const sixMonthsLater = new Date(today);
                sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
                
                const res = await fetch(`/api/appointments?startDate=${today.toISOString()}&endDate=${sixMonthsLater.toISOString()}&limit=200`);
                const data = await res.json();

                if (data.appointments) {
                    const mappedEvents = data.appointments.map((appt: Appointment) => {
                        const start = new Date(appt.scheduledDate);
                        // Calculate duration
                        const durationMinutes = appt.services?.reduce((acc, s) => acc + (s.duration || 30), 0) || 60;
                        const end = new Date(start.getTime() + durationMinutes * 60000);

                        let color = '#374151'; // default gray
                        if (appt.status === 'agendado') color = '#2563EB'; // Blue
                        if (appt.status === 'confirmado') color = '#06695C'; // Brand Green
                        if (appt.status === 'concluido') color = '#059669'; // Green-600
                        if (appt.status === 'cancelado') color = '#DC2626'; // Red
                        if (appt.status === 'em_andamento') color = '#D97706'; // Amber

                        return {
                            id: appt._id,
                            title: `${appt.patientId?.name || 'Pet'} - ${appt.services?.[0]?.name || 'Consulta'}`,
                            start: start.toISOString(),
                            end: end.toISOString(),
                            backgroundColor: color,
                            borderColor: color,
                            extendedProps: {
                                pet: appt.patientId?.name,
                                tutor: appt.patientId?.tutorName,
                                status: appt.status,
                                services: appt.services?.map(s => s.name).join(', ')
                            }
                        };
                    });
                    setEvents(mappedEvents);
                }
            } catch (error) {
                console.error("Error fetching agenda:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleEventClick = (info: { event: { id: string; title: string; extendedProps: Record<string, any> } }) => {
        // Redirect to appointment list filtered or details?
        // Ideally open a modal details. For now, simple alert or redirect could render a modal if I had one ready for Details.
        // I'll reuse the pattern of redirecting to Appointments page, but ideally we should have /admin/atendimentos/[id]
        // Let's settle for a nice info alert for now as "MVP" interaction
        const props = info.event.extendedProps;
        const confirmed = confirm(
            `Atendimento: ${info.event.title}\n` +
            `Tutor: ${props.tutor}\n` +
            `Status: ${props.status}\n` +
            `Serviços: ${props.services}\n\n` +
            `Deseja abrir os detalhes?`
        );
        if (confirmed) {
            // Note: We don't have a dedicated details page yet, sending to list
            // router.push(`/admin/atendimentos/${info.event.id}`);
            router.push('/admin/atendimentos');
        }
    };

    const handleDateClick = (info: { dateStr: string }) => {
        // Pass date to new appointment page
        router.push(`/admin/atendimentos/novo?date=${info.dateStr}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#00231F]">Agenda</h1>
                    <p className="text-gray-600 mt-1">Visualize e gerencie todos os atendimentos</p>
                </div>
                <button
                    onClick={() => router.push('/admin/atendimentos/novo')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#06695C] text-white font-semibold rounded-xl hover:bg-[#00231F] transition-all"
                >
                    + Novo Atendimento
                </button>
            </div>

            <Card hover={false} noPadding className="p-4 lg:p-6">
                <PawSkeleton isLoading={isLoading}>
                    <div className="fc-custom">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay',
                            }}
                            locale={ptBrLocale}
                            events={events}
                            eventClick={handleEventClick}
                            dateClick={handleDateClick}
                            editable={false} // Disable drag drop for now as backend update is not wired
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={true}
                            nowIndicator={true}
                            slotMinTime="07:00:00"
                            slotMaxTime="20:00:00"
                            height="auto"
                            eventDisplay="block"
                            slotDuration="00:30:00"
                            allDaySlot={false}
                        />
                    </div>
                </PawSkeleton>
            </Card>

            <style jsx global>{`
        .fc-custom .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #00231F !important;
        }
        .fc-custom .fc-button-primary {
          background-color: #06695C !important;
          border-color: #06695C !important;
        }
        .fc-custom .fc-button-primary:hover {
          background-color: #00231F !important;
          border-color: #00231F !important;
        }
        .fc-custom .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #00231F !important;
          border-color: #00231F !important;
        }
        .fc-custom .fc-event {
          border-radius: 6px !important;
          border: none !important;
          padding: 2px 4px !important;
          font-size: 0.85rem !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .fc-custom .fc-timegrid-slot {
          height: 3rem !important;
        }
        .fc-custom .fc-col-header-cell {
          background-color: #FAF8F5 !important;
          padding: 8px 0 !important;
        }
        .fc-custom .fc-scrollgrid {
          border-color: #E5E7EB !important;
        }
        .fc-custom td, .fc-custom th {
          border-color: #E5E7EB !important;
        }
      `}</style>
        </div>
    );
}
