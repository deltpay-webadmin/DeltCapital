import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Video, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImg from 'figma:asset/1b671918dc7eb5e903d907e0296cd36873db0947.png';
import danielImg from 'figma:asset/7eef1f088272da3e3d67e767838454ce718ae9b8.png';
import robertImg from 'figma:asset/4543e99095f890598800c1c013641147ec3bd3c1.png';
import elenaImg from 'figma:asset/9c8d4b8619a0d5258cf2c1f94b219c645bd218ba.png';

interface BookingPageProps {
  onClose: () => void;
}

interface Specialist {
  id: number;
  name: string;
  title: string;
  image: string;
  expertise: string;
}

export default function BookingPage({ onClose }: BookingPageProps) {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 6, 1)); // July 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 6, 22)); // July 22
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<number>(1);

  const specialists: Specialist[] = [
    {
      id: 1,
      name: 'Daniel Martinez',
      title: 'Funding Advisor',
      image: danielImg,
      expertise: 'Guides merchants through the approval and funding process.'
    },
    {
      id: 2,
      name: 'Elena Morgan',
      title: 'Funding Advisor',
      image: elenaImg,
      expertise: 'Guides merchants through the approval and funding process.'
    },
    {
      id: 3,
      name: 'Robert Klein',
      title: 'Director of Underwriting & Risk Management',
      image: robertImg,
      expertise: 'Oversees approvals and ensures all funding decisions align with company guidelines.'
    }
  ];

  const activeSpecialist = specialists.find(s => s.id === selectedSpecialist) || specialists[0];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const timeSlots = [
    '10:00am',
    '11:00am',
    '1:00pm',
    '2:30pm',
    '4:00pm'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setSelectedTime(null);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[selectedDate.getDay()]}, ${months[selectedDate.getMonth()]} ${selectedDate.getDate()}`;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#020C1B] z-50 overflow-auto">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div className="lg:w-80 bg-white dark:bg-[#0A1628] border-r border-[#E4E7EB] dark:border-[#1F2933] p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="mb-8 text-[#041E42] dark:text-white hover:text-[#4945ff] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Specialist Info */}
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full mb-4 overflow-hidden border-2 border-[#4945ff]">
              <ImageWithFallback
                src={activeSpecialist.image}
                alt={activeSpecialist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-[#041E42] dark:text-white mb-1">{activeSpecialist.name}</h3>
            <p className="text-sm text-[#4945ff] dark:text-[#60A5FA] font-semibold mb-1">{activeSpecialist.title}</p>
            <p className="text-xs text-[#4B5563] dark:text-[#9AA5B1] mb-4">{activeSpecialist.expertise}</p>
            <h2 className="text-xl font-bold text-[#041E42] dark:text-white">Client Consultation</h2>
          </div>

          {/* Meeting Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[#4B5563] dark:text-[#9AA5B1]">
              <Clock className="w-5 h-5" />
              <span className="text-sm">30 min</span>
            </div>
            <div className="flex items-center gap-3 text-[#4B5563] dark:text-[#9AA5B1]">
              <Video className="w-5 h-5" />
              <span className="text-sm">Zoom</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 lg:p-12 pt-16 lg:pt-20">
          <div className="max-w-4xl mx-auto">
            {/* Specialist Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#041E42] dark:text-white mb-4">Choose Your Funding Specialist</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {specialists.map((specialist) => (
                  <button
                    key={specialist.id}
                    onClick={() => setSelectedSpecialist(specialist.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      ${selectedSpecialist === specialist.id
                        ? 'border-[#4945ff] bg-[#EFF6FF] dark:bg-[#1E40AF]/10'
                        : 'border-[#E4E7EB] dark:border-[#1F2933] hover:border-[#4945ff]/50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4945ff]">
                        <ImageWithFallback
                          src={specialist.image}
                          alt={specialist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#041E42] dark:text-white text-sm">{specialist.name}</h4>
                        <p className="text-xs text-[#4945ff] dark:text-[#60A5FA]">{specialist.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#4B5563] dark:text-[#9AA5B1]">{specialist.expertise}</p>
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#041E42] dark:text-white mb-8">Select a Date & Time</h2>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Calendar Section */}
              <div className="flex-1">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-[#F9FAFB] dark:hover:bg-[#1F2933] rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#041E42] dark:text-white" />
                  </button>
                  <h3 className="text-lg font-semibold text-[#041E42] dark:text-white">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-[#F9FAFB] dark:hover:bg-[#1F2933] rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-[#041E42] dark:text-white" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="border border-[#E4E7EB] dark:border-[#1F2933] rounded-lg overflow-hidden">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 bg-[#F9FAFB] dark:bg-[#0A1628]">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-xs font-semibold text-[#6B7280] dark:text-[#9AA5B1]"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7">
                    {days.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => day && handleDateClick(day)}
                        disabled={!day}
                        className={`
                          aspect-square p-3 text-center border-t border-r border-[#E4E7EB] dark:border-[#1F2933]
                          ${index % 7 === 0 ? 'border-l-0' : ''}
                          ${!day ? 'bg-[#F9FAFB] dark:bg-[#0A1628] cursor-default' : ''}
                          ${day && !isDateSelected(day) ? 'hover:bg-[#EFF6FF] dark:hover:bg-[#1E40AF]/10 cursor-pointer' : ''}
                          ${isDateSelected(day) ? 'bg-[#4945ff] text-white font-bold' : 'text-[#041E42] dark:text-white'}
                          transition-colors
                        `}
                      >
                        {day || ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Zone */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-[#041E42] dark:text-white mb-2">
                    Time zone
                  </label>
                  <select className="w-full px-4 py-2 border border-[#E4E7EB] dark:border-[#1F2933] rounded-lg bg-white dark:bg-[#0A1628] text-[#041E42] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4945ff]">
                    <option>Eastern time - US & Canada</option>
                    <option>Pacific time - US & Canada</option>
                    <option>Central time - US & Canada</option>
                    <option>Mountain time - US & Canada</option>
                  </select>
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="lg:w-72">
                {selectedDate && (
                  <>
                    <h4 className="text-sm font-semibold text-[#041E42] dark:text-white mb-4">
                      {formatSelectedDate()}
                    </h4>
                    <div className="space-y-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            w-full px-4 py-3 rounded-lg text-center font-medium transition-colors
                            ${selectedTime === time
                              ? 'bg-[#4945ff] text-white'
                              : 'border-2 border-[#4945ff] text-[#4945ff] hover:bg-[#EFF6FF] dark:hover:bg-[#1E40AF]/10'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>

                    {/* Confirm Button */}
                    {selectedTime && (
                      <button className="w-full mt-6 px-6 py-3 bg-[#4945ff] hover:bg-[#3b38d9] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                        Confirm
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}