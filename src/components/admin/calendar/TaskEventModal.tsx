
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CalendarTask } from '@/services/calendarService';

interface TaskEventModalProps {
  event: CalendarTask | any | null;
  isOpen: boolean;
  onClose: () => void;
}

const TaskEventModal: React.FC<TaskEventModalProps> = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  const isCompliance = 'compliance_type' in event;

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
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCompliance ? (
              <>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  Compliance Deadline
                </Badge>
                {event.compliance_type}
              </>
            ) : (
              <>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Task
                </Badge>
                {event.title}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isCompliance ? (
            <>
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Compliance Type</h4>
                <p className="text-sm">{event.compliance_type}</p>
              </div>

              {event.form_activity && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Form/Activity</h4>
                  <p className="text-sm">{event.form_activity}</p>
                </div>
              )}

              {event.description && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Description</h4>
                  <p className="text-sm">{event.description}</p>
                </div>
              )}

              {event.relevant_fy_ay && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Relevant FY/AY</h4>
                  <p className="text-sm">{event.relevant_fy_ay}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Deadline Date</h4>
                <p className="text-sm">{new Date(event.deadline_date).toLocaleDateString()}</p>
              </div>
            </>
          ) : (
            <>
              {event.description && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Description</h4>
                  <p className="text-sm">{event.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Priority</h4>
                  <Badge variant={getPriorityColor(event.priority)}>
                    {event.priority}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Status</h4>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                    {event.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {event.category_name && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Category</h4>
                  <p className="text-sm">{event.category_name}</p>
                </div>
              )}

              {event.assigned_to_name && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Assigned To</h4>
                  <p className="text-sm">{event.assigned_to_name}</p>
                </div>
              )}

              {event.client_name && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">Client</h4>
                  <p className="text-sm">{event.client_name}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {event.start_date && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Start Date</h4>
                    <p className="text-sm">{new Date(event.start_date).toLocaleDateString()}</p>
                  </div>
                )}

                {event.deadline_date && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Deadline Date</h4>
                    <p className="text-sm">{new Date(event.deadline_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEventModal;
