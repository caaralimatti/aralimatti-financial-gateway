
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceList from './billing/InvoiceList';
import TimeTracking from './billing/TimeTracking';
import BillingAnalytics from './billing/BillingAnalytics';

const BillingDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-muted-foreground">
            Manage invoices, track time, and monitor billing analytics
          </p>
        </div>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="time-tracking">Time Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Billing Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <InvoiceList />
        </TabsContent>

        <TabsContent value="time-tracking">
          <TimeTracking />
        </TabsContent>

        <TabsContent value="analytics">
          <BillingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingDashboard;
