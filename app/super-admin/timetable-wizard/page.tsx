'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { 
  Calendar, Users, Clock, CalendarDays, Sparkles, ChevronRight, ChevronLeft, 
  Check, Loader2, Plus, Trash2, Search, AlertCircle, Settings
} from 'lucide-react';
import { useState } from 'react';

interface TeacherEntry {
  registerNumber: string;
  name: string;
  subjects: string[];
  isLoading: boolean;
  error?: string;
}

interface PeriodConfig {
  periodNumber: number;
  startTime: string;
  endTime: string;
  type: 'regular' | 'break' | 'lunch';
  name: string;
}

interface Holiday {
  date: string;
  name: string;
  type: 'national' | 'school' | 'vacation';
}

const STEPS = [
  { id: 1, title: 'Teachers', icon: Users, description: 'Enter teacher register numbers' },
  { id: 2, title: 'Schedule', icon: Clock, description: 'Configure periods and timings' },
  { id: 3, title: 'Holidays', icon: CalendarDays, description: 'Set holidays and events' },
  { id: 4, title: 'Generate', icon: Sparkles, description: 'Review and generate timetable' },
];

const DEFAULT_PERIODS: PeriodConfig[] = [
  { periodNumber: 1, startTime: '08:00', endTime: '08:45', type: 'regular', name: 'Period 1' },
  { periodNumber: 2, startTime: '08:45', endTime: '09:30', type: 'regular', name: 'Period 2' },
  { periodNumber: 3, startTime: '09:30', endTime: '10:15', type: 'regular', name: 'Period 3' },
  { periodNumber: 4, startTime: '10:15', endTime: '10:30', type: 'break', name: 'Short Break' },
  { periodNumber: 5, startTime: '10:30', endTime: '11:15', type: 'regular', name: 'Period 4' },
  { periodNumber: 6, startTime: '11:15', endTime: '12:00', type: 'regular', name: 'Period 5' },
  { periodNumber: 7, startTime: '12:00', endTime: '12:45', type: 'lunch', name: 'Lunch Break' },
  { periodNumber: 8, startTime: '12:45', endTime: '13:30', type: 'regular', name: 'Period 6' },
  { periodNumber: 9, startTime: '13:30', endTime: '14:15', type: 'regular', name: 'Period 7' },
  { periodNumber: 10, startTime: '14:15', endTime: '15:00', type: 'regular', name: 'Period 8' },
];

const WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetableWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [teachers, setTeachers] = useState<TeacherEntry[]>([]);
  const [newRegisterNumber, setNewRegisterNumber] = useState('');
  const [periods, setPeriods] = useState<PeriodConfig[]>(DEFAULT_PERIODS);
  const [workingDays, setWorkingDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [generating, setGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<any>(null);

  // Subject hours per week (default)
  const [subjectHours, setSubjectHours] = useState<Record<string, number>>({
    'Mathematics': 6,
    'English': 5,
    'Hindi': 4,
    'Science': 6,
    'Social Studies': 4,
    'Computer Science': 3,
    'Physical Education': 2,
  });

  // Add teacher by register number
  const addTeacher = async () => {
    if (!newRegisterNumber.trim()) return;

    const regNum = newRegisterNumber.toUpperCase().trim();
    
    // Check if already added
    if (teachers.some(t => t.registerNumber === regNum)) {
      return;
    }

    // Add with loading state
    setTeachers(prev => [...prev, {
      registerNumber: regNum,
      name: '',
      subjects: [],
      isLoading: true,
    }]);
    setNewRegisterNumber('');

    try {
      const response = await fetch(`/api/teachers/by-register?registerNumber=${regNum}`);
      const data = await response.json();

      if (data.success) {
        setTeachers(prev => prev.map(t => 
          t.registerNumber === regNum 
            ? {
                ...t,
                name: data.teacher.name,
                subjects: data.teacher.subjects?.map((s: any) => s.name) || [],
                isLoading: false,
              }
            : t
        ));
      } else {
        setTeachers(prev => prev.map(t => 
          t.registerNumber === regNum 
            ? { ...t, isLoading: false, error: 'Teacher not found' }
            : t
        ));
      }
    } catch (error) {
      setTeachers(prev => prev.map(t => 
        t.registerNumber === regNum 
          ? { ...t, isLoading: false, error: 'Failed to fetch' }
          : t
      ));
    }
  };

  // Remove teacher
  const removeTeacher = (regNum: string) => {
    setTeachers(prev => prev.filter(t => t.registerNumber !== regNum));
  };

  // Toggle working day
  const toggleWorkingDay = (day: string) => {
    setWorkingDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Add holiday
  const addHoliday = () => {
    setHolidays(prev => [...prev, {
      date: new Date().toISOString().split('T')[0],
      name: '',
      type: 'school',
    }]);
  };

  // Update holiday
  const updateHoliday = (index: number, field: keyof Holiday, value: string) => {
    setHolidays(prev => prev.map((h, i) => 
      i === index ? { ...h, [field]: value } : h
    ));
  };

  // Remove holiday
  const removeHoliday = (index: number) => {
    setHolidays(prev => prev.filter((_, i) => i !== index));
  };

  // Generate timetable
  const generateTimetable = async () => {
    setGenerating(true);
    
    try {
      // Get all classes (mock for now - would come from API)
      const classes = [
        { name: 'Class 10', sections: ['A', 'B'] },
        { name: 'Class 9', sections: ['A', 'B'] },
      ];

      const response = await fetch('/api/ai/generate-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teachers: teachers.filter(t => !t.error).map(t => ({
            registerNumber: t.registerNumber,
            name: t.name,
            subjects: t.subjects,
          })),
          classes,
          periodsPerDay: periods.filter(p => p.type === 'regular').length,
          workingDays,
          subjectHoursPerWeek: subjectHours,
          constraints: {
            maxConsecutivePeriodsPerTeacher: 3,
            avoidBackToBackSameSubject: true,
            preferMorningForMath: true,
          },
        }),
      });

      const data = await response.json();
      setGeneratedTimetable(data);
    } catch (error) {
      console.error('Failed to generate timetable:', error);
    } finally {
      setGenerating(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blue-400" />
            Timetable Generation Wizard
          </h2>
          <p className="text-muted-foreground">Create AI-optimized timetables for {academicYear}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">AI Powered</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                currentStep === step.id 
                  ? 'bg-blue-500/20 border border-blue-500/50' 
                  : currentStep > step.id 
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-muted/50 border border-border'
              }`}
              onClick={() => step.id < currentStep && setCurrentStep(step.id)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step.id 
                  ? 'bg-blue-500 text-white' 
                  : currentStep > step.id 
                    ? 'bg-green-500 text-white'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <ChevronRight className="w-5 h-5 text-muted-foreground mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6 min-h-[400px]">
          
          {/* Step 1: Teachers */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Add Teachers by Register Number
              </h3>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newRegisterNumber}
                  onChange={(e) => setNewRegisterNumber(e.target.value.toUpperCase())}
                  placeholder="Enter teacher register number (e.g., TCH001)"
                  className="flex-1 px-4 py-3 rounded-lg bg-muted border border-border focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addTeacher()}
                />
                <button
                  onClick={addTeacher}
                  className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Lookup
                </button>
              </div>

              <div className="space-y-3">
                {teachers.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No teachers added yet. Enter a register number above to add teachers.
                  </p>
                )}
                
                {teachers.map((teacher) => (
                  <div
                    key={teacher.registerNumber}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      teacher.error 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      {teacher.registerNumber.slice(-2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{teacher.registerNumber}</span>
                        {teacher.isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                      </div>
                      {teacher.error ? (
                        <p className="text-sm text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {teacher.error}
                        </p>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">{teacher.name || 'Loading...'}</p>
                          {teacher.subjects.length > 0 && (
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {teacher.subjects.map(s => (
                                <span key={s} className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => removeTeacher(teacher.registerNumber)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Configure Schedule
              </h3>

              {/* Working Days */}
              <div>
                <label className="block text-sm font-medium mb-3">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {WORKING_DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleWorkingDay(day)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        workingDays.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted border border-border hover:bg-muted/80'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Period Timings */}
              <div>
                <label className="block text-sm font-medium mb-3">Period Timings</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {periods.map((period, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className={`w-24 text-sm font-medium ${
                        period.type === 'break' ? 'text-yellow-400' :
                        period.type === 'lunch' ? 'text-orange-400' : ''
                      }`}>
                        {period.name}
                      </span>
                      <input
                        type="time"
                        value={period.startTime}
                        onChange={(e) => {
                          const newPeriods = [...periods];
                          newPeriods[index].startTime = e.target.value;
                          setPeriods(newPeriods);
                        }}
                        className="px-3 py-1 rounded bg-background border border-border"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={period.endTime}
                        onChange={(e) => {
                          const newPeriods = [...periods];
                          newPeriods[index].endTime = e.target.value;
                          setPeriods(newPeriods);
                        }}
                        className="px-3 py-1 rounded bg-background border border-border"
                      />
                      <select
                        value={period.type}
                        onChange={(e) => {
                          const newPeriods = [...periods];
                          newPeriods[index].type = e.target.value as 'regular' | 'break' | 'lunch';
                          setPeriods(newPeriods);
                        }}
                        className="px-3 py-1 rounded bg-background border border-border"
                      >
                        <option value="regular">Regular Period</option>
                        <option value="break">Break</option>
                        <option value="lunch">Lunch</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Holidays */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-green-400" />
                Set Holidays & Special Days
              </h3>

              <button
                onClick={addHoliday}
                className="w-full py-3 rounded-lg border-2 border-dashed border-border hover:border-green-500 text-muted-foreground hover:text-green-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Holiday
              </button>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {holidays.map((holiday, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <input
                      type="date"
                      value={holiday.date}
                      onChange={(e) => updateHoliday(index, 'date', e.target.value)}
                      className="px-3 py-2 rounded bg-background border border-border"
                    />
                    <input
                      type="text"
                      value={holiday.name}
                      onChange={(e) => updateHoliday(index, 'name', e.target.value)}
                      placeholder="Holiday name"
                      className="flex-1 px-3 py-2 rounded bg-background border border-border"
                    />
                    <select
                      value={holiday.type}
                      onChange={(e) => updateHoliday(index, 'type', e.target.value)}
                      className="px-3 py-2 rounded bg-background border border-border"
                    >
                      <option value="national">National</option>
                      <option value="school">School</option>
                      <option value="vacation">Vacation</option>
                    </select>
                    <button
                      onClick={() => removeHoliday(index)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {holidays.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No holidays added. Click above to add holidays for the academic year.
                </p>
              )}
            </div>
          )}

          {/* Step 4: Generate */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Review & Generate Timetable
              </h3>

              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-2xl font-bold text-blue-400">{teachers.filter(t => !t.error).length}</p>
                  <p className="text-sm text-muted-foreground">Teachers Added</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{workingDays.length}</p>
                  <p className="text-sm text-muted-foreground">Working Days</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-2xl font-bold text-green-400">{periods.filter(p => p.type === 'regular').length}</p>
                  <p className="text-sm text-muted-foreground">Periods/Day</p>
                </div>
              </div>

              <button
                onClick={generateTimetable}
                disabled={generating || teachers.filter(t => !t.error).length === 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Timetable with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Timetable
                  </>
                )}
              </button>

              {/* Generated Result */}
              {generatedTimetable && (
                <div className={`p-4 rounded-lg ${
                  generatedTimetable.success 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  {generatedTimetable.success ? (
                    <div className="space-y-2">
                      <p className="font-medium text-green-400 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Timetable Generated Successfully!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {generatedTimetable.summary?.totalPeriods || 0} periods scheduled for {generatedTimetable.summary?.classesScheduled || 0} classes
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-medium text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Generation Failed
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {generatedTimetable.error || 'Please try again'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        {currentStep < 4 && (
          <button
            onClick={nextStep}
            className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
