
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileText } from 'lucide-react';
import { Task } from '@/types/task';
import TaskBasicInfo from './details/TaskBasicInfo';
import TaskAssignmentInfo from './details/TaskAssignmentInfo';
import TaskTimelineInfo from './details/TaskTimelineInfo';
import TaskSubTasks from './details/TaskSubTasks';
import TaskComments from './details/TaskComments';
import TaskAttachments from './details/TaskAttachments';

interface TaskDetailsModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, open, onOpenChange }) => {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <TaskBasicInfo task={task} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskAssignmentInfo task={task} />
            <TaskTimelineInfo task={task} />
          </div>

          <TaskSubTasks task={task} />
          <TaskComments task={task} />
          <TaskAttachments task={task} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
