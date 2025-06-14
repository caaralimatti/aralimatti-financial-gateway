
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AnalyticsFilters {
  dateRange: string;
  staffMember: string;
  clientType: string;
  taskStatus: string;
  taskCategory: string;
}

interface AnalyticsFiltersProps {
  filters: AnalyticsFilters;
  onFilterChange: (key: keyof AnalyticsFilters, value: string) => void;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <Select value={filters.dateRange} onValueChange={(value) => onFilterChange('dateRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="180">Last 6 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffMember">Staff Member</Label>
            <Select value={filters.staffMember} onValueChange={(value) => onFilterChange('staffMember', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {/* These would be populated from actual data */}
                <SelectItem value="staff1">John Doe</SelectItem>
                <SelectItem value="staff2">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientType">Client Type</Label>
            <Select value={filters.clientType} onValueChange={(value) => onFilterChange('clientType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="trust">Trust</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskStatus">Task Status</Label>
            <Select value={filters.taskStatus} onValueChange={(value) => onFilterChange('taskStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="to_do">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskCategory">Task Category</Label>
            <Select value={filters.taskCategory} onValueChange={(value) => onFilterChange('taskCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="gst">GST</SelectItem>
                <SelectItem value="income_tax">Income Tax</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsFilters;
