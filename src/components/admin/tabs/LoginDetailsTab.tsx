
import React from 'react';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';
import GSTLoginSection from './login/GSTLoginSection';
import ITLoginSection from './login/ITLoginSection';
import TracesLoginSection from './login/TracesLoginSection';
import OtherLoginSection from './login/OtherLoginSection';

interface LoginDetailsTabProps {
  clientForm: any;
  setClientForm: (form: any) => void;
}

const LoginDetailsTab = ({ clientForm, setClientForm }: LoginDetailsTabProps) => {
  const { showPassword, togglePassword } = usePasswordVisibility();

  return (
    <div className="space-y-6">
      <GSTLoginSection
        clientForm={clientForm}
        setClientForm={setClientForm}
        showGstPassword={showPassword.gstPassword}
        onToggleGstPassword={() => togglePassword('gstPassword')}
      />

      <ITLoginSection
        clientForm={clientForm}
        setClientForm={setClientForm}
        showItPassword={showPassword.itPassword}
        showItDeductorPassword={showPassword.itDeductorPassword}
        onToggleItPassword={() => togglePassword('itPassword')}
        onToggleItDeductorPassword={() => togglePassword('itDeductorPassword')}
      />

      <TracesLoginSection
        clientForm={clientForm}
        setClientForm={setClientForm}
        showTracesDeductorPassword={showPassword.tracesDeductorPassword}
        showTracesTaxpayerPassword={showPassword.tracesTaxpayerPassword}
        onToggleTracesDeductorPassword={() => togglePassword('tracesDeductorPassword')}
        onToggleTracesTaxpayerPassword={() => togglePassword('tracesTaxpayerPassword')}
      />

      <OtherLoginSection
        clientForm={clientForm}
        setClientForm={setClientForm}
        showMcaV2Password={showPassword.mcaV2Password}
        showMcaV3Password={showPassword.mcaV3Password}
        showDgftPassword={showPassword.dgftPassword}
        onToggleMcaV2Password={() => togglePassword('mcaV2Password')}
        onToggleMcaV3Password={() => togglePassword('mcaV3Password')}
        onToggleDgftPassword={() => togglePassword('dgftPassword')}
      />
    </div>
  );
};

export default LoginDetailsTab;
