
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, BarChart3 } from 'lucide-react';
import GSTSidebar from '@/components/gst/GSTSidebar';
import GSTHeader from '@/components/gst/GSTHeader';
import GSTOnboardingChecklist from '@/components/gst/GSTOnboardingChecklist';

const GSTRegistration = () => {
  const { profile, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          <GSTSidebar />

          <SidebarInset className="flex-1">
            <GSTHeader
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              profile={profile}
              onLogout={handleLogout}
            />

            <main className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    GST Registration & Onboarding
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage GST registrations and client onboarding
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <FileText className="h-3 w-3 mr-1" />
                  Registration Portal
                </Badge>
              </div>

              {/* Updated Disclaimer */}
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    Important Pro-Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>Ensure all uploaded files (JPEG/PDF) are under <strong>100 KB</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>For rented or shared premises, a <strong>No Objection Certificate (NOC)</strong> from the owner is mandatory and a common point of rejection if missed.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>The name and address on all documents must <strong>exactly match</strong> the details in the application form to avoid delays.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Tabs defaultValue="onboarding" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="onboarding" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Client Onboarding
                  </TabsTrigger>
                  <TabsTrigger value="applications" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Applications
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="onboarding" className="space-y-6">
                  <GSTOnboardingChecklist />
                </TabsContent>

                <TabsContent value="applications" className="space-y-6">
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Application Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Track and manage GST registration applications
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Analytics Dashboard
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      View registration statistics and trends
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default GSTRegistration;
