
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download,
  Upload,
  Settings
} from 'lucide-react';

interface TaskFiltersProps {
  selectedFilters: {
    status: string;
    priority: string;
    category: string;
    assignedTo: string;
    dateRange: string;
  };
  setSelectedFilters: (filters: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedFilters,
  setSelectedFilters,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode
}) => {
  const activeFiltersCount = Object.values(selectedFilters).filter(value => value !== 'all').length;

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks, clients, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-2 flex-wrap">
              <Select
                value={selectedFilters.status}
                onValueChange={(value) => setSelectedFilters({...selectedFilters, status: value})}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="need-approval">Need Approval</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedFilters.priority}
                onValueChange={(value) => setSelectedFilters({...selectedFilters, priority: value})}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedFilters.category}
                onValueChange={(value) => setSelectedFilters({...selectedFilters, category: value})}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="gst">GST</SelectItem>
                  <SelectItem value="roc">ROC</SelectItem>
                  <SelectItem value="itr">ITR</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  <Filter className="h-3 w-3 mr-1" />
                  {activeFiltersCount} active
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {/* View Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Bulk Actions */}
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Custom View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskFilters;
