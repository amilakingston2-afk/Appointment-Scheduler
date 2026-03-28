/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, Search, Star, Calendar as CalendarIcon, Phone, Contact2, PhoneMissed, PhoneIncoming, PhoneOutgoing, X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Mock Data ---

type Tab = 'calendar' | 'calls' | 'contacts';

const CONTACTS = [
  {
    id: 1,
    name: 'Alice Vance',
    role: 'Design Consultant',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgD3EVGVCkQmB1eVikT0_bv9MWL0xV8lpTU4tdk9cl-WEhEsCyI3gYA111BhE3vFZotzT4liKb5xFOkIsIiWQOiZFwAj-miYo5Z6_oPjT82ALMGjCkxKQaewkZ8ic1j71GuWyvk_olA5Zp49s_uR6eZ3Lx-tTynySxsxmBVg5iORTo-yZz4_zOwCW2AxRacTd867qX63XAWVhF5_ZL73-v6klBZfVzuAIYerMkyxsLDapZzlyTqCLWmJIgDbp37k-NW2Ixqo9gQNaL',
    starred: false,
    letter: 'A',
  },
  {
    id: 2,
    name: 'Arthur Morgan',
    role: 'Project Architect',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB2PQeS1qMipbCczj4yd9NJ-6LlSg73gpfLgCGpQ2CboPmiMcyZOQkBcz3xtwlWTxonVXJmWUbWgwVu12xqOngnWMzH4mfjuFOS1CvWtO01kCX1Bu8Yo4cJSq9hbz7lceEplhXMv1trYmTC9x5jQg37sSy0rKQhAP-D06dgLmxKFhaSM2D1eScHQDx9-FOaj3pwn6Bn7PUb5osjAddKW6Ew4pAxtWPQblSsYtjKEpi1vkvdct9cAI57y7qrKCgeqUU4KDZJaibvKfn',
    starred: false,
    letter: 'A',
  },
  {
    id: 3,
    name: 'Bethany Lowes',
    role: 'Financial Analyst',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPFRH4UX3dosOa_cRp30QTJ-OH7xaObgVHw_aLa2Nqn5AwAhX_XSzpWorz6-YDQaEct_FT3_q9OjT3gF0aMC5cfWVu3kj2Df-ROpsak7pBfjMHL2QImELJQgRs-6cHLC_pEcfaoABaIz3HxQON3O5dC_JQogKPdsSeUMMEw2pryjnP9A6apxNydohpXSNeEYjmTwoEmoIdbXxz-52_p0dBEeFGwqJEIBPRo04J-suGk_Fm07qP5dhSXLfMTY3ZmmzB1Yqam1DNofJF',
    starred: false,
    letter: 'B',
  },
  {
    id: 4,
    name: 'Calvin Harris',
    role: 'Creative Lead',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnAYV4u3Q5Iudr3KK8jh5k5KUOz2yiP46xxY6XeFc53Z-wrFp34XjjB6ayhFL4DCXWhyZfRiHEuLJnBVP67duIB-yoO2vcYAt5NupwFyrbHQ6JcZDtSuPL3ttnxT6vlt_wCm4cGE_QzoPXTVek24B82u-YjEKiLuTT9O5mXeq1k0MgpI8cVdzSPYpx6xZOp9EHlWZQGLP0jeEEmwbB1QSOpN7Cnoo9BqVOYX2DQKbbVzIuNwtaDN59HIIsgua3KmpO4jMW8xSGoCIC',
    starred: true,
    letter: 'C',
  },
];

const INITIAL_CALLS = [
  { id: 1, contactId: 1, type: 'missed', time: '10:30 AM', date: 'Today' },
  { id: 2, contactId: 2, type: 'incoming', time: '04:15 PM', date: 'Yesterday' },
  { id: 3, contactId: 4, type: 'outgoing', time: '09:00 AM', date: 'Monday' },
  { id: 4, contactId: 3, type: 'incoming', time: '11:20 AM', date: 'Last Week' },
];

const INITIAL_APPOINTMENTS = [
  { id: 1, title: 'Project Kickoff', time: '09:00 AM', duration: '1h', contactId: 2, date: new Date().toISOString().split('T')[0] },
  { id: 2, title: 'Design Review', time: '02:00 PM', duration: '45m', contactId: 1, date: new Date().toISOString().split('T')[0] },
];

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

// --- Components ---

const Header = () => (
  <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl">
    <div className="flex items-center justify-between px-6 h-16 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button className="active:scale-95 transition-transform duration-200 text-primary">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-sans tracking-[2.5px] uppercase text-sm font-bold text-primary">
          MY Appointments
        </h1>
      </div>
      <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high active:scale-95 transition-transform duration-200 cursor-pointer">
        <img
          alt="User profile"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCD5iDEDAt7484Z1IPeWao0u1qUPsJKOmULddmaCJb4cKYYqNd4K7b7qRYPqQH-qOmgkBDRtXRCAqVS0ujjKv9YQLazQpgqa8bXNyK8ZBYOkMKLmeNExdkQJaygWVuUp3rgA0TC3_EscBcpMi6uUl0agw8HtGseW4GhUiGHRvGSy7zl4kadr0IJVgFGBvPtSS7Eb6LviwKgDDYE_jXVeo-EJip1Lml_XGPltr_ZJIKfzwC3IOPRhAIEB7jlkvSYHl5IFCO3_Tn43Jy"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </header>
);

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: Tab, setActiveTab: (t: Tab) => void }) => (
  <nav className="fixed bottom-0 left-0 w-full z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,94,182,0.06)] border-none">
    <div className="flex justify-around items-center h-20 px-4 w-full max-w-lg mx-auto">
      <button 
        onClick={() => setActiveTab('calendar')}
        className={`flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300 ${activeTab === 'calendar' ? 'text-primary bg-surface-container-low rounded-2xl' : 'text-outline hover:text-primary'}`}
      >
        <CalendarIcon className="w-6 h-6 mb-1" />
        <span className="font-sans text-[11px] font-medium tracking-wide">Calendar</span>
      </button>
      <button 
        onClick={() => setActiveTab('calls')}
        className={`flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300 ${activeTab === 'calls' ? 'text-primary bg-surface-container-low rounded-2xl' : 'text-outline hover:text-primary'}`}
      >
        <Phone className="w-6 h-6 mb-1" />
        <span className="font-sans text-[11px] font-medium tracking-wide">Calls</span>
      </button>
      <button 
        onClick={() => setActiveTab('contacts')}
        className={`flex flex-col items-center justify-center px-5 py-2 transition-all active:scale-90 duration-300 ${activeTab === 'contacts' ? 'text-primary bg-surface-container-low rounded-2xl' : 'text-outline hover:text-primary'}`}
      >
        <Contact2 className="w-6 h-6 mb-1" />
        <span className="font-sans text-[11px] font-medium tracking-wide">Contacts</span>
      </button>
    </div>
  </nav>
);

// --- Views ---

const ContactsView = ({ onSchedule }: { onSchedule: (contact: typeof CONTACTS[0]) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const groupedContacts = CONTACTS.reduce((acc, contact) => {
    if (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        contact.role.toLowerCase().includes(searchQuery.toLowerCase())) {
      if (!acc[contact.letter]) acc[contact.letter] = [];
      acc[contact.letter].push(contact);
    }
    return acc;
  }, {} as Record<string, typeof CONTACTS>);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Contacts</h2>
            <p className="text-on-surface-variant text-base">Manage your network and schedule new sessions.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border-none focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline-variant"
            />
          </div>
        </div>
      </section>

      <div className="space-y-16">
        {Object.entries(groupedContacts).map(([letter, contacts]) => (
          <div key={letter} className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-6">
            <div className="hidden lg:flex flex-col items-center">
              <span className="text-5xl font-black text-surface-container-highest tracking-tighter select-none">
                {letter}
              </span>
              <div className="w-px h-full bg-surface-container mt-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {contacts.map(contact => (
                <div key={contact.id} className="bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between group hover:bg-surface-bright transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-high">
                      <img alt={contact.name} src={contact.image} className="w-full h-full object-cover" />
                    </div>
                    <button className="active:scale-90 transition-transform">
                      <Star className={`w-6 h-6 transition-colors ${contact.starred ? 'text-primary fill-primary' : 'text-outline-variant group-hover:text-primary'}`} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-1">{contact.name}</h3>
                    <p className="text-on-surface-variant text-sm mb-6">{contact.role}</p>
                    <button 
                      onClick={() => onSchedule(contact)}
                      className="w-full py-3 px-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg font-bold text-xs tracking-widest uppercase active:scale-[0.98] transition-all"
                    >
                      Schedule Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(groupedContacts).length === 0 && (
          <div className="text-center py-12">
            <p className="text-on-surface-variant text-lg">No contacts found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CallsView = ({ onSchedule }: { onSchedule: (contact: typeof CONTACTS[0]) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Recent Calls</h2>
        <p className="text-on-surface-variant text-base">Review your call history and follow up.</p>
      </div>

      <div className="flex flex-col gap-6">
        {INITIAL_CALLS.map(call => {
          const contact = CONTACTS.find(c => c.id === call.contactId)!;
          return (
            <div key={call.id} className="bg-surface-container-lowest p-4 sm:p-6 rounded-xl flex items-center justify-between group hover:bg-surface-bright transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                  <img alt={contact.name} src={contact.image} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{contact.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-1">
                    {call.type === 'missed' && <PhoneMissed className="w-4 h-4 text-error" />}
                    {call.type === 'incoming' && <PhoneIncoming className="w-4 h-4 text-primary" />}
                    {call.type === 'outgoing' && <PhoneOutgoing className="w-4 h-4 text-outline" />}
                    <span>{call.date} at {call.time}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onSchedule(contact)}
                className="hidden sm:block py-2 px-6 bg-surface-container-low text-primary hover:bg-surface-container rounded-lg font-bold text-xs tracking-widest uppercase active:scale-[0.98] transition-all"
              >
                Follow Up
              </button>
              <button 
                onClick={() => onSchedule(contact)}
                className="sm:hidden p-3 bg-surface-container-low text-primary hover:bg-surface-container rounded-full active:scale-[0.98] transition-all"
              >
                <CalendarIcon className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const CalendarView = ({ appointments }: { appointments: typeof INITIAL_APPOINTMENTS }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
  };

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const dayAppointments = appointments.filter(app => app.date === selectedDateStr);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Calendar</h2>
          <p className="text-on-surface-variant text-base">Your upcoming sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Calendar Grid */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-on-surface">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-[1px] bg-surface-container rounded-xl overflow-hidden p-[1px]">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="bg-surface-container-lowest py-3 text-center text-xs font-bold text-outline-variant uppercase tracking-wider">
                {day}
              </div>
            ))}
            {blanks.map(blank => (
              <div key={`blank-${blank}`} className="bg-surface-container-lowest aspect-square" />
            ))}
            {days.map(day => {
              const selected = isSelected(day);
              const current = isToday(day);
              
              // Check if this day has appointments
              const dStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasAppts = appointments.some(a => a.date === dStr);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  className={`bg-surface-container-lowest aspect-square flex flex-col items-center justify-center relative transition-colors hover:bg-surface-bright ${selected ? 'bg-primary text-on-primary hover:bg-primary' : 'text-on-surface'}`}
                >
                  <span className={`text-sm font-medium ${selected ? 'text-on-primary' : ''}`}>{day}</span>
                  {current && !selected && <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-primary" />}
                  {current && selected && <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-on-primary" />}
                  {hasAppts && !current && <div className={`absolute bottom-2 w-1 h-1 rounded-full ${selected ? 'bg-primary-container' : 'bg-tertiary'}`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-on-surface">
            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h3>
          
          {dayAppointments.length === 0 ? (
            <div className="bg-surface-container-low/50 border border-surface-container p-8 rounded-2xl text-center">
              <p className="text-on-surface-variant text-lg">No appointments scheduled.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayAppointments.map(app => {
                const contact = CONTACTS.find(c => c.id === app.contactId)!;
                return (
                  <div key={app.id} className="bg-surface-container-lowest p-5 rounded-xl flex items-center gap-5 shadow-[0_4px_24px_rgba(0,94,182,0.03)]">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                      <img alt={contact.name} src={contact.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-on-surface">{app.title}</h4>
                      <p className="text-sm text-on-surface-variant">with {contact.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">{app.time}</div>
                      <div className="text-xs text-outline-variant mt-0.5">{app.duration}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Modals ---

const ScheduleModal = ({ 
  contact, 
  onClose, 
  onConfirm 
}: { 
  contact: typeof CONTACTS[0], 
  onClose: () => void,
  onConfirm: (date: string, time: string) => void 
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // For simplicity in the modal, we just use today's date or tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const handleConfirm = () => {
    if (selectedTime) {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      onConfirm(dateStr, selectedTime);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-0">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-surface/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div
        initial={{ y: '100%', opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-surface-container-lowest/80 backdrop-blur-[24px] p-6 sm:p-8 rounded-t-3xl sm:rounded-3xl shadow-[0_0_32px_rgba(0,82,161,0.06)] border border-surface-container-lowest"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-outline hover:text-on-surface transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-high shrink-0">
            <img alt={contact.name} src={contact.image} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-surface">Schedule Session</h3>
            <p className="text-on-surface-variant text-sm">with {contact.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">Select Date</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedDate(today)}
                className={`flex-1 py-3 px-4 rounded-xl border ${selectedDate === today ? 'bg-surface-container-low border-primary text-primary' : 'bg-transparent border-surface-container text-on-surface-variant hover:border-outline-variant'} transition-all`}
              >
                <div className="text-xs font-medium mb-1">Today</div>
                <div className="text-sm font-bold">{today.toLocaleDateString('default', { month: 'short', day: 'numeric' })}</div>
              </button>
              <button 
                onClick={() => setSelectedDate(tomorrow)}
                className={`flex-1 py-3 px-4 rounded-xl border ${selectedDate === tomorrow ? 'bg-surface-container-low border-primary text-primary' : 'bg-transparent border-surface-container text-on-surface-variant hover:border-outline-variant'} transition-all`}
              >
                <div className="text-xs font-medium mb-1">Tomorrow</div>
                <div className="text-sm font-bold">{tomorrow.toLocaleDateString('default', { month: 'short', day: 'numeric' })}</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-3 uppercase tracking-wider">Select Time</label>
            <div className="flex flex-wrap gap-3">
              {TIME_SLOTS.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 px-5 rounded-full text-sm font-medium transition-all ${
                    selectedTime === time 
                      ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-md' 
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-surface-container">
            <button 
              disabled={!selectedTime}
              onClick={handleConfirm}
              className="w-full py-4 px-4 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold text-sm tracking-widest uppercase active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('contacts');
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [schedulingContact, setSchedulingContact] = useState<typeof CONTACTS[0] | null>(null);

  const handleScheduleConfirm = (date: string, time: string) => {
    if (schedulingContact) {
      const newAppt = {
        id: Date.now(),
        title: 'Consultation Session',
        time,
        duration: '1h',
        contactId: schedulingContact.id,
        date
      };
      setAppointments([...appointments, newAppt]);
      setSchedulingContact(null);
      setActiveTab('calendar'); // Switch to calendar to see the new appointment
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 font-sans selection:bg-primary-container selection:text-on-primary-container">
      <Header />
      
      <main className="pt-24 px-6 sm:px-8 lg:px-16 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'contacts' && <ContactsView key="contacts" onSchedule={setSchedulingContact} />}
          {activeTab === 'calls' && <CallsView key="calls" onSchedule={setSchedulingContact} />}
          {activeTab === 'calendar' && <CalendarView key="calendar" appointments={appointments} />}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <AnimatePresence>
        {schedulingContact && (
          <ScheduleModal 
            contact={schedulingContact} 
            onClose={() => setSchedulingContact(null)} 
            onConfirm={handleScheduleConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
