
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarTask, CalendarCompliance } from '@/services/calendarService';

interface DayTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  events: (CalendarTask | CalendarCompliance)[];
}

const DayTasksModal: React.FC<DayTasksModalProps> = ({ isOpen, onClose, date, events }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            All Tasks for {formatDate(date)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={`${event.id}-${index}`} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {'compliance_type' in event ? (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                        Compliance
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        Task
                      </Badge>
                    )}
                    <Badge variant={getPriorityColor(event.priority)}>
                      {event.priority}
                    </Badge>
                  </div>

                  <h3 className="font-medium text-lg">
                    {'title' in event ? event.title : 
                     `${event.compliance_type}${event.form_activity ? ` - ${event.form_activity}` : ''}`}
                  </h3>

                  {event.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {event.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {'status' in event && (
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                    )}
                    
                    {'client_name' in event && event.client_name && (
                      <span>Client: {event.client_name}</span>
                    )}
                    
                    {'assigned_to_name' in event && event.assigned_to_name && (
                      <span>Assigned to: {event.assigned_to_name}</span>
                    )}

                    {'relevant_fy_ay' in event && event.relevant_fy_ay && (
                      <span>FY/AY: {event.relevant_fy_ay}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayTasksModal;
