
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';
import type { ClientFormData } from '@/types/clientForm';

interface ClientOnboardingProgressProps {
  clientForm: ClientFormData;
}

const ClientOnboardingProgress = ({ clientForm }: ClientOnboardingProgressProps) => {
  const steps = [
    {
      name: 'Basic Details',
      completed: !!(clientForm.basicDetails.fileNo && clientForm.basicDetails.name),
      required: true
    },
    {
      name: 'Tax Configuration',
      completed: Object.values(clientForm.taxesApplicable).some(Boolean),
      required: true
    },
    {
      name: 'Tax Details',
      completed: !!(clientForm.incomeTaxDetails.pan || clientForm.incomeTaxDetails.tan),
      required: false
    },
    {
      name: 'Contact Persons',
      completed: clientForm.contactPersons && clientForm.contactPersons.length > 0,
      required: false
    },
    {
      name: 'Login Details',
      completed: !!(clientForm.loginDetails.itPan || clientForm.loginDetails.gstNumber),
      required: false
    },
    {
      name: 'Custom Fields',
      completed: clientForm.customFields && clientForm.customFields.length > 0,
      required: false
    },
    {
      name: 'Attachments',
      completed: clientForm.attachments && clientForm.attachments.length > 0,
      required: false
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const requiredSteps = steps.filter(step => step.required);
  const completedRequiredSteps = requiredSteps.filter(step => step.completed).length;
  const allRequiredCompleted = completedRequiredSteps === requiredSteps.length;

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Client Onboarding Progress</h3>
        <span className="text-sm text-gray-600">
          {completedSteps} of {totalSteps} completed
        </span>
      </div>
      
      <Progress value={progressPercentage} className="w-full" />
      
      <div className="grid grid-cols-2 gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {step.completed ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Circle className="h-4 w-4 text-gray-300" />
            )}
            <span className={`${step.completed ? 'text-green-700' : 'text-gray-500'}`}>
              {step.name}
              {step.required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </div>
        ))}
      </div>
      
      {!allRequiredCompleted && (
        <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
          Complete all required fields (*) before saving the client.
        </div>
      )}
      
      {allRequiredCompleted && completedSteps < totalSteps && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          Great! Required fields completed. Consider adding optional details for better client management.
        </div>
      )}
      
      {completedSteps === totalSteps && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
          🎉 Client profile is fully complete! Ready to save.
        </div>
      )}
    </div>
  );
};

export default ClientOnboardingProgress;
