
import { useState } from 'react';
import { ClientCalendarTask, ClientCalendarData } from '@/types/clientCalendar';

export const useTaskModal = (clientCalendarData: ClientCalendarData) => {
  const [selectedTask, setSelectedTask] = useState<ClientCalendarTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (taskId: string) => {
    // Find the task in the calendar data
    let foundTask: ClientCalendarTask | null = null;
    
    Object.values(clientCalendarData).forEach(tasks => {
      const task = tasks.find(t => t.id === taskId || t.id === taskId.replace('-start', ''));
      if (task) {
        foundTask = task;
      }
    });
    
    if (foundTask) {
      setSelectedTask(foundTask);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return {
    selectedTask,
    isModalOpen,
    handleTaskClick,
    handleCloseModal
  };
};
