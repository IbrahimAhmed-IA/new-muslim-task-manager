'use client';

import React, { useState } from 'react';
import { useTaskContext } from '@/context/task-context';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { DayOfWeek, Priority } from '@/lib/types';
import { FaPray, FaCheck, FaPlus } from 'react-icons/fa';

// Define predefined worship tasks
const worshipTasks = [
  { id: 'fajr', title: 'Fajr Prayer', category: 'Daily Prayers' },
  { id: 'dhuhr', title: 'Dhuhr Prayer', category: 'Daily Prayers' },
  { id: 'asr', title: 'Asr Prayer', category: 'Daily Prayers' },
  { id: 'maghrib', title: 'Maghrib Prayer', category: 'Daily Prayers' },
  { id: 'isha', title: 'Isha Prayer', category: 'Daily Prayers' },
  { id: 'quran', title: 'Read Quran (1 page)', category: 'Quran Reading' },
  { id: 'quran5', title: 'Read Quran (5 pages)', category: 'Quran Reading' },
  { id: 'quran10', title: 'Read Quran (10 pages)', category: 'Quran Reading' },
  { id: 'quran-hizb', title: 'Read Quran (1 Hizb)', category: 'Quran Reading' },
  { id: 'quran-juz', title: 'Read Quran (1 Juz)', category: 'Quran Reading' },
  { id: 'morning-dhikr', title: 'Morning Adhkar', category: 'Adhkar' },
  { id: 'evening-dhikr', title: 'Evening Adhkar', category: 'Adhkar' },
  { id: 'sleep-dhikr', title: 'Sleep Adhkar', category: 'Adhkar' },
  { id: 'istighfar-100', title: 'Istighfar (100 times)', category: 'Dhikr' },
  { id: 'tasbih-100', title: 'Tasbih (100 times)', category: 'Dhikr' },
  { id: 'salawat-100', title: 'Salawat on Prophet (100 times)', category: 'Dhikr' },
  { id: 'duha-prayer', title: 'Duha Prayer', category: 'Optional Prayers' },
  { id: 'tahajjud', title: 'Tahajjud Prayer', category: 'Optional Prayers' },
  { id: 'witr', title: 'Witr Prayer', category: 'Optional Prayers' },
  { id: 'fast-monday', title: 'Fast (Monday)', category: 'Fasting' },
  { id: 'fast-thursday', title: 'Fast (Thursday)', category: 'Fasting' },
  { id: 'fast-white-days', title: 'Fast (White Days: 13, 14, 15)', category: 'Fasting' },
  { id: 'charity', title: 'Give Charity', category: 'Good Deeds' },
  { id: 'visit-sick', title: 'Visit the Sick', category: 'Good Deeds' },
  { id: 'help-someone', title: 'Help Someone in Need', category: 'Good Deeds' },
  { id: 'hadith-study', title: 'Study Hadith', category: 'Knowledge' },
  { id: 'islamic-lecture', title: 'Listen to Islamic Lecture', category: 'Knowledge' },
  { id: 'islamic-book', title: 'Read Islamic Book', category: 'Knowledge' },
];

// Group tasks by category
const groupedTasks = worshipTasks.reduce<Record<string, typeof worshipTasks>>((acc, task) => {
  if (!acc[task.category]) {
    acc[task.category] = [];
  }
  acc[task.category].push(task);
  return acc;
}, {});

// Category icons and colors
const categoryStyles = {
  'Daily Prayers': { icon: 'FaPray', color: 'from-indigo-600 to-blue-600', bgColor: 'bg-indigo-50' },
  'Quran Reading': { icon: 'FaBook', color: 'from-emerald-600 to-teal-600', bgColor: 'bg-emerald-50' },
  'Adhkar': { icon: 'FaHandsWash', color: 'from-blue-600 to-cyan-600', bgColor: 'bg-blue-50' },
  'Dhikr': { icon: 'FaHeart', color: 'from-pink-600 to-rose-600', bgColor: 'bg-pink-50' },
  'Optional Prayers': { icon: 'FaPray', color: 'from-purple-600 to-violet-600', bgColor: 'bg-purple-50' },
  'Fasting': { icon: 'FaMoon', color: 'from-amber-600 to-yellow-600', bgColor: 'bg-amber-50' },
  'Good Deeds': { icon: 'FaHandsHelping', color: 'from-green-600 to-emerald-600', bgColor: 'bg-green-50' },
  'Knowledge': { icon: 'FaBook', color: 'from-cyan-600 to-sky-600', bgColor: 'bg-cyan-50' }
};

export default function WorshipTasksManager() {
  const { addTask } = useTaskContext();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('saturday');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');
  const [applyToAllDays, setApplyToAllDays] = useState(false);

  const days: DayOfWeek[] = [
    'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
  ];

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks((prev) => [...prev, taskId]);
    } else {
      setSelectedTasks((prev) => prev.filter(id => id !== taskId));
    }
  };

  const handleAddTasks = () => {
    if (selectedTasks.length === 0) {
      toast.error('Please select at least one task');
      return;
    }

    const selectedTasksData = worshipTasks.filter(task => selectedTasks.includes(task.id));

    if (applyToAllDays) {
      // Add to all days with unique IDs for each task
      let addedCount = 0;
      days.forEach((day, dayIndex) => {
        selectedTasksData.forEach((task, taskIndex) => {
          // Create a unique ID for each task based on current time, day, and task
          const uniqueId = Date.now() + dayIndex + taskIndex;
          addTask(task.title, day, selectedPriority);
          addedCount++;
        });
      });
      toast.success(`Added ${addedCount} worship tasks to all days`);
    } else {
      // Add to selected day only
      selectedTasksData.forEach(task => {
        addTask(task.title, selectedDay, selectedPriority);
      });
      toast.success(`Added ${selectedTasksData.length} worship tasks to ${selectedDay}`);
    }

    // Clear selections
    setSelectedTasks([]);
  };

  const handleSelectAll = (category: string) => {
    const categoryTaskIds = groupedTasks[category].map(task => task.id);

    // Check if all tasks in this category are already selected
    const allSelected = categoryTaskIds.every(id => selectedTasks.includes(id));

    if (allSelected) {
      // If all are selected, deselect them
      setSelectedTasks(prev => prev.filter(id => !categoryTaskIds.includes(id)));
    } else {
      // If not all are selected, select all in this category
      const newSelected = [...selectedTasks];
      categoryTaskIds.forEach(id => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });
      setSelectedTasks(newSelected);
    }
  };

  // Get color for priority
  const getPriorityColor = (priority: Priority) => {
    const colors = {
      low: 'text-blue-500 border-blue-300',
      medium: 'text-yellow-600 border-yellow-300',
      high: 'text-red-500 border-red-300'
    };
    return colors[priority];
  };

  return (
    <div className="py-6 w-full fade-in">
      <header className="page-header">
        <h1 className="text-3xl font-bold mb-1">Muslim's Worship Tasks</h1>
        <p className="text-white/80">Schedule your spiritual activities</p>
      </header>

      <div className="container mx-auto p-6">
        <div className="card p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-4 shadow-md">
              <FaPray className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Add Worship Tasks</h2>
              <p className="text-gray-500">Select tasks to add to your daily schedule</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Day</label>
                <Select
                  value={selectedDay}
                  onValueChange={(value: DayOfWeek) => setSelectedDay(value)}
                  disabled={applyToAllDays}
                >
                  <SelectTrigger className="w-full capitalize input-enhanced">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day} className="capitalize">
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Priority</label>
                <Select
                  value={selectedPriority}
                  onValueChange={(value: Priority) => setSelectedPriority(value)}
                >
                  <SelectTrigger className={`w-full capitalize input-enhanced ${getPriorityColor(selectedPriority)}`}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="text-blue-500 font-medium">Low Priority</SelectItem>
                    <SelectItem value="medium" className="text-yellow-600 font-medium">Medium Priority</SelectItem>
                    <SelectItem value="high" className="text-red-500 font-medium">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <Checkbox
                id="apply-all-days"
                checked={applyToAllDays}
                onCheckedChange={(checked) => setApplyToAllDays(checked === true)}
                className="text-indigo-600 rounded"
              />
              <label
                htmlFor="apply-all-days"
                className="text-sm font-medium leading-none cursor-pointer text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Apply to all days of the week
              </label>
            </div>

            <Button
              onClick={handleAddTasks}
              className="w-full btn-primary py-6"
              disabled={selectedTasks.length === 0}
            >
              <FaPlus className="mr-2" /> Add Selected Tasks ({selectedTasks.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groupedTasks).map(([category, tasks], index) => (
              <Card key={category} className="border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardHeader className={`bg-gradient-to-r ${categoryStyles[category]?.color || 'from-gray-600 to-gray-500'} text-white`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <FaPray className="mr-2" /> {category}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-white/10 border-white/30 text-white hover:text-indigo-600 hover:bg-white transition-colors"
                      onClick={() => handleSelectAll(category)}
                    >
                      {tasks.every(task => selectedTasks.includes(task.id)) ? (
                        <><FaCheck className="mr-1" /> Deselect All</>
                      ) : (
                        'Select All'
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-gray-50 ${
                          selectedTasks.includes(task.id) ? `${categoryStyles[category]?.bgColor} border border-gray-200` : ''
                        }`}
                      >
                        <Checkbox
                          id={task.id}
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={(checked) => handleTaskToggle(task.id, checked === true)}
                          className="text-indigo-600"
                        />
                        <label
                          htmlFor={task.id}
                          className="text-sm font-medium leading-none cursor-pointer flex-1 hover:text-indigo-600 transition-colors"
                        >
                          {task.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
