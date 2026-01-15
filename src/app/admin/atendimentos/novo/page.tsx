'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

import Card from '@/components/ui/Card';
import { PawSkeleton } from '@/components/ui/PawLoader';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { FiArrowLeft, FiSearch, FiCalendar, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { FaPaw, FaDog, FaCat, FaFeatherAlt } from 'react-icons/fa';
import { GiTurtle, GiRabbit, GiRat } from 'react-icons/gi';

interface Patient {
    _id: string;
    name: string;
    tutorName: string;
    species: string;
    breed?: string;
}

interface Service {
    _id: string;
    name: string;
    price: number;
    duration: number;
    description?: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor: string;
    textColor?: string;
    display?: string;
}

const getSpeciesIcon = (species: string) => {
    const s = species?.toLowerCase() || '';
    if (s.includes('cão') || s.includes('canino')) return FaDog;
    if (s.includes('gato') || s.includes('felino')) return FaCat;
    if (s.includes('ave')) return FaFeatherAlt;
    if (s.includes('reptil')) return GiTurtle;
    if (s.includes('roedor')) return GiRat;
    if (s.includes('coelho') || s.includes('lagomorfo')) return GiRabbit;
    return FaPaw;
};

export default function NovoAtendimentoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedDate = searchParams.get('date');

    const [isLoading, setIsLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [apiEvents, setApiEvents] = useState<CalendarEvent[]>([]); // Store original API events
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]); // Displayed events

    // UI State
    const [searchTerm, setSearchTerm] = useState('');
    const [showPatientList, setShowPatientList] = useState(false);

    // Form State
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [scheduledDate, setScheduledDate] = useState(preSelectedDate ? preSelectedDate.split('T')[0] : '');
    const [scheduledTime, setScheduledTime] = useState(preSelectedDate ? new Date(preSelectedDate).toTimeString().substring(0, 5) : '');
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('');

    // Calendar Ref
    const calendarRef = useRef<FullCalendar>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Calculate date range for appointments (next 3 months)
                const today = new Date();
                const threeMonthsLater = new Date(today);
                threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
                
                const [resServices, resPatients, resAppts] = await Promise.all([
                    fetch('/api/services?active=true'),
                    fetch('/api/patients?limit=100'),
                    fetch(`/api/appointments?startDate=${today.toISOString()}&endDate=${threeMonthsLater.toISOString()}&limit=100`)
                ]);

                const dataServices = await resServices.json();
                if (dataServices.services) setServices(dataServices.services);

                const dataPatients = await resPatients.json();
                if (dataPatients.patients) setPatients(dataPatients.patients);

                const dataAppts = await resAppts.json();
                if (dataAppts.appointments) {
                    const events = dataAppts.appointments.map((appt: any) => {
                        const start = new Date(appt.scheduledDate);
                        const duration = appt.services?.reduce((acc: number, s: any) => acc + (s.duration || 30), 0) || 60;
                        const end = new Date(start.getTime() + duration * 60000);
                        return {
                            id: appt._id,
                            title: 'Ocupado',
                            start: start.toISOString(),
                            end: end.toISOString(),
                            backgroundColor: '#E5E7EB', // Gray for occupied
                            textColor: '#6B7280',
                            display: 'block'
                        };
                    });
                    setApiEvents(events);
                    setCalendarEvents(events);
                }

            } catch (e) { console.error(e); }
        };
        fetchInitialData();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tutorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalValue = services
        .filter(s => selectedServices.includes(s._id))
        .reduce((sum, s) => sum + s.price, 0);

    const totalDuration = services
        .filter(s => selectedServices.includes(s._id))
        .reduce((sum, s) => sum + (s.duration || 30), 0);

    // Update Calendar Preview when Time or Services change
    useEffect(() => {
        if (!scheduledDate || !scheduledTime) {
            setCalendarEvents(apiEvents); // Reset to base events
            return;
        }

        const start = new Date(`${scheduledDate}T${scheduledTime}`);
        // Ensure valid date
        if (isNaN(start.getTime())) return;

        // Use totalDuration or default 60min if no service selected yet
        const duration = totalDuration > 0 ? totalDuration : 60;
        const end = new Date(start.getTime() + duration * 60000);

        const previewEvent: CalendarEvent = {
            id: 'preview-event',
            title: 'Novo Agendamento',
            start: start.toISOString(),
            end: end.toISOString(),
            backgroundColor: '#06695C',
            textColor: '#FFFFFF',
            display: 'block'
        };

        setCalendarEvents([...apiEvents, previewEvent]);

    }, [scheduledDate, scheduledTime, totalDuration, apiEvents]);

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handlePatientSelect = (patient: Patient) => {
        setSelectedPatient(patient);
        setSearchTerm('');
        setShowPatientList(false);
    };

    const handleDateSelect = (selectInfo: any) => {
        const date = new Date(selectInfo.start);
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().substring(0, 5);

        setScheduledDate(dateStr);
        setScheduledTime(timeStr);

        // Remove selection highlight since we create a custom event
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!selectedPatient || !scheduledDate || !scheduledTime || selectedServices.length === 0) {
            alert('Por favor, preencha: Paciente, Data, Hora e Serviços.');
            setIsLoading(false);
            return;
        }

        try {
            const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: selectedPatient._id,
                    scheduledDate: dateTime,
                    services: selectedServices,
                    notes,
                    location,
                    status: 'agendado',
                    totalValue: totalValue
                }),
            });

            if (res.ok) {
                router.push('/admin/agenda');
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao agendar');
            }
        } catch (error) {
            alert('Erro de conexão ao agendar');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-gray-600 hover:text-[#06695C] transition-colors rounded-full hover:bg-gray-100"
                >
                    <FiArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-[#00231F]">Novo Agendamento</h1>
                    <p className="text-gray-600">Selecione paciente, serviços e horário na agenda</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Column */}
                <div className="xl:col-span-2 space-y-6">

                    {/* 1. Patient */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-[#00231F] mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#06695C]/10 text-[#06695C] flex items-center justify-center text-sm"><FaPaw /></span>
                            1. Paciente
                        </h2>

                        {!selectedPatient ? (
                            <div className="relative">
                                <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#06695C] transition-all bg-gray-50">
                                    <FiSearch className="text-gray-400 mr-3" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Buscar paciente ou tutor..."
                                        className="w-full bg-transparent outline-none text-gray-700"
                                        value={searchTerm}
                                        onChange={e => { setSearchTerm(e.target.value); setShowPatientList(true); }}
                                        onFocus={() => setShowPatientList(true)}
                                    />
                                </div>

                                {showPatientList && searchTerm && (
                                    <div className="absolute z-10 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                                        {filteredPatients.length === 0 ? (
                                            <div className="p-4 text-center">
                                                <p className="text-gray-500 mb-2">Nenhum paciente encontrado com &quot;{searchTerm}&quot;</p>
                                                <a href="/admin/pacientes/novo" className="text-[#06695C] font-semibold hover:underline">Cadastrar Novo Paciente</a>
                                            </div>
                                        ) : (
                                            filteredPatients.map(p => {
                                                const Icon = getSpeciesIcon(p.species);
                                                return (
                                                    <button
                                                        key={p._id}
                                                        type="button"
                                                        onClick={() => handlePatientSelect(p)}
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-[#06695C]/10 flex items-center justify-center text-[#06695C]">
                                                            <Icon />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#00231F]">{p.name}</p>
                                                            <p className="text-xs text-gray-500">{p.tutorName} • {p.species}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-[#06695C]/5 border border-[#06695C]/20 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#06695C] text-white flex items-center justify-center text-xl shadow-md">
                                        {(() => { const Icon = getSpeciesIcon(selectedPatient.species); return <Icon />; })()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-[#00231F]">{selectedPatient.name}</p>
                                        <p className="text-sm text-gray-600">Tutor: {selectedPatient.tutorName}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPatient(null)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 2. Services */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-[#00231F] mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#06695C]/10 text-[#06695C] flex items-center justify-center text-sm"><FiCheck /></span>
                            2. Serviços
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {services.map(service => (
                                <label
                                    key={service._id}
                                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedServices.includes(service._id)
                                        ? 'border-[#06695C] bg-[#06695C]/5'
                                        : 'border-white bg-gray-50 hover:border-gray-200'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={selectedServices.includes(service._id)}
                                        onChange={() => toggleService(service._id)}
                                    />
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-[#00231F]">{service.name}</span>
                                        {selectedServices.includes(service._id) && (
                                            <div className="w-5 h-5 bg-[#06695C] rounded-full flex items-center justify-center text-white text-xs">
                                                <FiCheck />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-auto flex justify-between items-end">
                                        <span className="text-xs text-gray-500">{service.duration} min</span>
                                        <span className="font-bold text-[#06695C]">R$ {service.price.toFixed(2)}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 3. Selecione o Horário e Local */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-[#00231F] mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#06695C]/10 text-[#06695C] flex items-center justify-center text-sm"><FiCalendar /></span>
                            3. Detalhes do Agendamento
                        </h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Local de Atendimento</label>
                            <Input
                                placeholder="Ex: Consultório 1, Domiciliar, etc. (Opcional)"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            />
                        </div>

                        <p className="text-sm text-gray-500 mb-4">Selecione o horário no calendário abaixo. O bloco verde mostra o tempo estimado.</p>

                        <div className="calendar-wrapper border rounded-xl overflow-hidden min-h-[500px]">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'timeGridWeek,timeGridDay'
                                }}
                                locale={ptBrLocale}
                                events={calendarEvents}
                                selectable={true}
                                selectMirror={false} // Disable standard mirror, we use custom event
                                select={handleDateSelect}
                                weekends={true}
                                slotMinTime="07:00:00"
                                slotMaxTime="20:00:00"
                                height="auto"
                                allDaySlot={false}
                                slotDuration="00:30:00"
                                initialDate={scheduledDate || undefined}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dia Selecionado</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50"
                                    value={scheduledDate}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hora de Início</label>
                                <input
                                    type="time"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50"
                                    value={scheduledTime}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-[#00231F] mb-2">Observações</h2>
                        <Textarea
                            placeholder="Informações adicionais..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                {/* Right Column: Sticky Summary */}
                <div className="xl:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card hover={false} className="bg-[#00231F] text-white border-0">
                            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Resumo</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-white/80">
                                    <span>Serviços ({selectedServices.length})</span>
                                    <span>R$ {totalValue.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/80">
                                    <span>Duração Estimada</span>
                                    <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}min</span>
                                </div>

                                {scheduledDate && scheduledTime && (
                                    <div className="bg-white/10 p-3 rounded-lg mt-4 animate-fade-in">
                                        <p className="text-xs text-white/60 mb-1">AGENDAMENTO PARA</p>
                                        <p className="font-bold flex items-center gap-2">
                                            <FiCalendar /> {new Date(scheduledDate).toLocaleDateString()}
                                        </p>
                                        <p className="font-bold flex items-center gap-2 mt-1">
                                            <FiClock /> {scheduledTime} - {new Date(new Date(`${scheduledDate}T${scheduledTime}`).getTime() + (totalDuration || 60) * 60000).toTimeString().substring(0, 5)}
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>R$ {totalValue.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                isLoading={isLoading}
                                className="w-full bg-[#06695C] hover:bg-[#0A8B7A] text-white border-none shadow-lg"
                                disabled={!selectedPatient || !scheduledDate || !scheduledTime || selectedServices.length === 0}
                            >
                                Confirmar Agendamento
                            </Button>
                        </Card>
                    </div>
                </div>
            </form>

            <style jsx global>{`
                .fc-toolbar-title { font-size: 1.1rem !important; }
                .fc-button { font-size: 0.8rem !important; }
            `}</style>
        </div>
    );
}
