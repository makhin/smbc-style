import { Button, ConfirmDialog, Toast } from '@smbc/ui';
import { useState } from 'react';
import Section from '../components/Section';

export default function DialogsSection() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  return (
    <Section id="dialogs" title="Dialogs & feedback">
      <div className="ds-control-row">
        <Button variant="primary" onClick={() => setPopupVisible(true)}>
          Open dialog
        </Button>
        <Button
          variant="secondary"
          devExtremeProps={{ type: 'normal' }}
          onClick={() => setToastVisible(true)}
        >
          Show success toast
        </Button>
      </div>
      <ConfirmDialog
        open={popupVisible}
        title="Approve payment?"
        message={
          <>
            You are approving <strong>PAY-2026-008421</strong> for 184,250.45
            EUR.
          </>
        }
        description="The payment will proceed to the next workflow stage."
        confirmLabel="Approve payment"
        onCancel={() => setPopupVisible(false)}
        onConfirm={() => {
          setPopupVisible(false);
          setToastVisible(true);
        }}
      />
      <Toast
        open={toastVisible}
        message="Payment approved."
        tone="success"
        duration={2500}
        onClose={() => setToastVisible(false)}
      />
    </Section>
  );
}
