import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const TaskSettings: React.FC = () => {
  // Settings state
  const [enablePriorities, setEnablePriorities] = useState(true);
  const [requireDeadlines, setRequireDeadlines] = useState(false);
  const [defaultAssignee, setDefaultAssignee] = useState('');
  const [allowDeleteCompleted, setAllowDeleteCompleted] = useState(true);

  // Dummy list of assignees for illustration
  const assignees = [
    { id: '', name: 'None' },
    { id: 'user1', name: 'Prabhudev' },
    { id: 'user2', name: 'Praeawae' },
    { id: 'user3', name: 'Aralimatti' },
  ];

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-xl font-bold">Task Settings</h2>
        <p className="text-gray-500">Control how task management behaves for the admin portal.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span>Enable Task Priorities</span>
          <Switch checked={enablePriorities} onCheckedChange={setEnablePriorities} />
        </div>
        <div className="flex items-center justify-between">
          <span>Require Deadlines for Tasks</span>
          <Switch checked={requireDeadlines} onCheckedChange={setRequireDeadlines} />
        </div>
        <div className="flex items-center justify-between">
          <span>Default Assignee for New Tasks</span>
          <select
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800"
            value={defaultAssignee}
            onChange={e => setDefaultAssignee(e.target.value)}
          >
            {assignees.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span>Allow Deletion of Completed Tasks</span>
          <Switch checked={allowDeleteCompleted} onCheckedChange={setAllowDeleteCompleted} />
        </div>
        <Button className="w-full mt-4" disabled>
          Save Settings (Demo Only)
        </Button>
      </CardContent>
    </Card>
  );
};

export default TaskSettings;
