
import React, { useState } from 'react';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { CheckSquare, ChevronDown, ChevronRight, BarChart3, Calendar, FolderOpen, Wrench } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TaskManagementDropdownProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TaskManagementDropdown: React.FC<TaskManagementDropdownProps> = ({ activeTab, setActiveTab }) => {
  const [taskManagementOpen, setTaskManagementOpen] = useState(false);

  return (
    <SidebarMenuItem>
      <Collapsible open={taskManagementOpen} onOpenChange={setTaskManagementOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="Task Management">
            <CheckSquare className="h-4 w-4" />
            <span>Task Management</span>
            {taskManagementOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('task-overview')}
                isActive={activeTab === 'task-overview'}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Task Overview</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('tasks')}
                isActive={activeTab === 'tasks'}
              >
                <CheckSquare className="h-4 w-4" />
                <span>All Tasks</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('task-calendar')}
                isActive={activeTab === 'task-calendar'}
              >
                <Calendar className="h-4 w-4" />
                <span>Task Calendar</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('categories')}
                isActive={activeTab === 'categories'}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Categories</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton
                onClick={() => setActiveTab('task-settings')}
                isActive={activeTab === 'task-settings'}
              >
                <Wrench className="h-4 w-4" />
                <span>Task Settings</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default TaskManagementDropdown;
