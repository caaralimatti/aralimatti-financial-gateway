
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Announcement } from '@/types/announcements';
import { format } from 'date-fns';
import AddAnnouncementModal from './AddAnnouncementModal';
import EditAnnouncementModal from './EditAnnouncementModal';
import DeleteAnnouncementModal from './DeleteAnnouncementModal';

const AnnouncementsManagement: React.FC = () => {
  const { announcements, isLoading, error } = useAnnouncements();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.target_audience.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTargetAudienceBadgeVariant = (audience: string) => {
    switch (audience) {
      case 'all':
        return 'default';
      case 'staff_portal':
        return 'secondary';
      case 'client_portal':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Normal':
        return 'default';
      case 'Low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTargetAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'all':
        return 'All Portals';
      case 'staff_portal':
        return 'Staff Only';
      case 'client_portal':
        return 'Client Only';
      default:
        return audience;
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowEditModal(true);
  };

  const handleDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Announcements</h2>
        <p className="text-gray-600">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Announcements Management</CardTitle>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search announcements by title, content, or audience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Target Audience</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">
                      {announcement.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTargetAudienceBadgeVariant(announcement.target_audience)}>
                        {getTargetAudienceLabel(announcement.target_audience)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                        {announcement.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(announcement.published_at), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {announcement.expires_at ? 
                        format(new Date(announcement.expires_at), 'MMM dd, yyyy HH:mm') : 
                        'No expiry'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(announcement)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No announcements found matching your search.' : 'No announcements found.'}
            </div>
          )}
        </CardContent>
      </Card>

      <AddAnnouncementModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditAnnouncementModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        announcement={selectedAnnouncement} 
      />
      <DeleteAnnouncementModal 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
        announcement={selectedAnnouncement} 
      />
    </div>
  );
};

export default AnnouncementsManagement;
