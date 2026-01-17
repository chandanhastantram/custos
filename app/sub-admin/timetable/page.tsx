'use client';

import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Calendar, Clock, Edit2, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface TimetableData {
  _id: string;
  name: string;
  class: { _id: string; name: string; sections?: string[] };
  section: string;
  isActive: boolean;
}

interface TimetableEntry {
  _id?: string;
  day: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: { _id: string; name: string } | string;
  teacher: { _id: string; name: string } | string;
  room?: string;
  type: 'regular' | 'lab' | 'activity';
}

interface SubjectOption {
  _id: string;
  name: string;
}

interface TeacherOption {
  _id: string;
  name: string;
}

interface ChangeLog {
  date: string;
  change: string;
  status: 'approved' | 'pending' | 'rejected';
}

export default function SubAdminTimetablePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [timetables, setTimetables] = useState<TimetableData[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<TimetableData | null>(null);
  const [entries, setEntries] = useState<Record<string, Record<number, TimetableEntry>>>({});
  const [editedEntries, setEditedEntries] = useState<Record<string, Record<number, TimetableEntry>>>({});
  
  // Mock change history (in production, this would come from API)
  const [changeHistory] = useState<ChangeLog[]>([
    { date: 'Jan 17', change: 'Updated Class 10A Monday Period 3 from Physics to Chemistry', status: 'approved' },
    { date: 'Jan 15', change: 'Swapped periods 4 and 5 for Class 9B on Wednesday', status: 'pending' },
    { date: 'Jan 12', change: 'Added extra class for Class 8A on Saturday', status: 'rejected' },
  ]);

  // Mock data for subjects and teachers
  const subjects: SubjectOption[] = [
    { _id: 'subj1', name: 'Mathematics' },
    { _id: 'subj2', name: 'English' },
    { _id: 'subj3', name: 'Physics' },
    { _id: 'subj4', name: 'Chemistry' },
    { _id: 'subj5', name: 'Biology' },
    { _id: 'subj6', name: 'History' },
    { _id: 'subj7', name: 'Geography' },
    { _id: 'subj8', name: 'Computer' },
    { _id: 'subj9', name: 'PE' },
    { _id: 'subj10', name: 'Art' },
  ];

  const teachers: TeacherOption[] = [
    { _id: 'teach1', name: 'Mr. Smith' },
    { _id: 'teach2', name: 'Ms. Johnson' },
    { _id: 'teach3', name: 'Mr. Brown' },
    { _id: 'teach4', name: 'Ms. Davis' },
    { _id: 'teach5', name: 'Mr. Wilson' },
    { _id: 'teach6', name: 'Ms. Taylor' },
    { _id: 'teach7', name: 'Mr. Lee' },
    { _id: 'teach8', name: 'Ms. Green' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { num: 1, time: '08:00 - 08:45', start: '08:00', end: '08:45' },
    { num: 2, time: '08:45 - 09:30', start: '08:45', end: '09:30' },
    { num: 3, time: '09:45 - 10:30', start: '09:45', end: '10:30' },
    { num: 4, time: '10:30 - 11:15', start: '10:30', end: '11:15' },
    { num: 5, time: '11:30 - 12:15', start: '11:30', end: '12:15' },
    { num: 6, time: '12:15 - 13:00', start: '12:15', end: '13:00' },
  ];

  // Fetch all timetables
  const fetchTimetables = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/timetables');
      const data = await response.json();
      if (data.success) {
        setTimetables(data.data);
        if (data.data.length > 0 && !selectedTimetable) {
          setSelectedTimetable(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTimetable]);

  // Fetch entries for selected timetable
  const fetchEntries = useCallback(async (timetableId: string) => {
    try {
      const response = await fetch(`/api/timetables/${timetableId}`);
      const data = await response.json();
      if (data.success && data.data.entries) {
        const entriesMap: Record<string, Record<number, TimetableEntry>> = {};
        data.data.entries.forEach((entry: TimetableEntry) => {
          if (!entriesMap[entry.day]) {
            entriesMap[entry.day] = {};
          }
          entriesMap[entry.day][entry.periodNumber] = entry;
        });
        setEntries(entriesMap);
        setEditedEntries(entriesMap);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }, []);

  useEffect(() => {
    fetchTimetables();
  }, []);

  useEffect(() => {
    if (selectedTimetable) {
      fetchEntries(selectedTimetable._id);
    }
  }, [selectedTimetable, fetchEntries]);

  // Update entry in edit mode
  const handleEntryChange = (day: string, periodNum: number, field: 'subject' | 'teacher', value: string) => {
    setEditedEntries(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [periodNum]: {
          ...prev[day]?.[periodNum],
          day,
          periodNumber: periodNum,
          startTime: periods.find(p => p.num === periodNum)?.start || '08:00',
          endTime: periods.find(p => p.num === periodNum)?.end || '08:45',
          [field]: value,
          type: prev[day]?.[periodNum]?.type || 'regular',
        },
      },
    }));
  };

  // Save all changes
  const handleSaveChanges = async () => {
    if (!selectedTimetable) return;

    try {
      setIsSaving(true);

      // Collect all entries to save
      const entriesToSave: any[] = [];
      Object.entries(editedEntries).forEach(([day, dayEntries]) => {
        Object.entries(dayEntries).forEach(([periodNum, entry]) => {
          if (entry.subject && entry.teacher) {
            entriesToSave.push({
              day: entry.day,
              periodNumber: entry.periodNumber,
              startTime: entry.startTime,
              endTime: entry.endTime,
              subject: typeof entry.subject === 'object' ? entry.subject._id : entry.subject,
              teacher: typeof entry.teacher === 'object' ? entry.teacher._id : entry.teacher,
              type: entry.type || 'regular',
            });
          }
        });
      });

      // Delete existing entries and create new ones
      const currentEntries = Object.values(entries).flatMap(dayEntries => 
        Object.values(dayEntries).filter(e => e._id)
      );

      for (const entry of currentEntries) {
        if (entry._id) {
          await fetch(`/api/timetables/entries/${entry._id}`, { method: 'DELETE' });
        }
      }

      // Create new entries
      if (entriesToSave.length > 0) {
        await fetch('/api/timetables/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timetable: selectedTimetable._id,
            entries: entriesToSave,
          }),
        });
      }

      await fetchEntries(selectedTimetable._id);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  const getSubjectName = (entry: TimetableEntry | undefined): string => {
    if (!entry?.subject) return '-';
    if (typeof entry.subject === 'object') return entry.subject.name;
    return subjects.find(s => s._id === entry.subject)?.name || entry.subject;
  };

  const getTeacherName = (entry: TimetableEntry | undefined): string => {
    if (!entry?.teacher) return '-';
    if (typeof entry.teacher === 'object') return entry.teacher.name;
    return teachers.find(t => t._id === entry.teacher)?.name || entry.teacher;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading timetables...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Calendar className="w-7 h-7" />
            Edit Timetable
          </h2>
          <p className="text-muted-foreground">Modify class schedules (limited to assigned classes)</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setEditedEntries(entries);
                  setIsEditing(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
              Edit Mode
            </button>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="relative rounded-xl border border-blue-500/30 p-1">
        <div className="relative bg-blue-500/10 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-medium text-blue-400">Note:</span> You can only edit timetables for classes assigned to you. Changes will be saved directly.
          </p>
        </div>
      </div>

      {/* Timetable Selector */}
      {timetables.length > 0 ? (
        <div className="flex gap-2 flex-wrap">
          {timetables.map(tt => (
            <button
              key={tt._id}
              onClick={() => setSelectedTimetable(tt)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTimetable?._id === tt._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {tt.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No timetables available. Contact Super Admin to create timetables.</p>
        </div>
      )}

      {/* Timetable Grid */}
      {selectedTimetable && (
        <div className="relative rounded-2xl border border-border p-1 overflow-x-auto">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="relative bg-card rounded-xl p-4 min-w-[700px]">
            <h3 className="text-lg font-semibold mb-4">{selectedTimetable.name} - Weekly Schedule</h3>
            
            <div className="grid grid-cols-6 gap-2">
              {/* Header Row */}
              <div className="p-3 rounded-lg bg-muted/50 font-medium text-center">
                <Clock className="w-5 h-5 mx-auto mb-1" />
                Period
              </div>
              {days.map(day => (
                <div key={day} className="p-3 rounded-lg bg-muted/50 font-medium text-center">
                  {day}
                </div>
              ))}

              {/* Period Rows */}
              {periods.map(period => (
                <>
                  <div key={`period-${period.num}`} className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="font-medium text-sm">P{period.num}</p>
                    <p className="text-xs text-muted-foreground">{period.time}</p>
                  </div>
                  {days.map(day => {
                    const cell = isEditing 
                      ? editedEntries[day]?.[period.num] 
                      : entries[day]?.[period.num];
                    
                    return (
                      <div
                        key={`${day}-${period.num}`}
                        className={`p-2 rounded-lg transition-colors ${
                          isEditing 
                            ? 'bg-muted/50 border-2 border-dashed border-blue-500/50'
                            : 'bg-muted/30'
                        }`}
                      >
                        {isEditing ? (
                          <div className="space-y-1">
                            <select
                              value={typeof cell?.subject === 'object' ? cell.subject._id : (cell?.subject || '')}
                              onChange={(e) => handleEntryChange(day, period.num, 'subject', e.target.value)}
                              className="w-full text-xs p-1 rounded bg-background border border-border"
                            >
                              <option value="">Subject</option>
                              {subjects.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                              ))}
                            </select>
                            <select
                              value={typeof cell?.teacher === 'object' ? cell.teacher._id : (cell?.teacher || '')}
                              onChange={(e) => handleEntryChange(day, period.num, 'teacher', e.target.value)}
                              className="w-full text-xs p-1 rounded bg-background border border-border"
                            >
                              <option value="">Teacher</option>
                              {teachers.map(t => (
                                <option key={t._id} value={t._id}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-xs">{getSubjectName(cell)}</p>
                            <p className="text-xs text-muted-foreground">{getTeacherName(cell)}</p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Changes */}
      <div className="relative rounded-2xl border border-border p-1">
        <GlowingEffect spread={30} glow={true} disabled={false} proximity={50} inactiveZone={0.1} borderWidth={2} />
        <div className="relative bg-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Changes</h3>
          <div className="space-y-3">
            {changeHistory.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm">{item.change}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
