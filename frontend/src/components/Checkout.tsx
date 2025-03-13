import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { CartItem } from '../types';

interface CheckoutProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onSuccess: () => void;
}

const steps = ['Review Order', 'Payment', 'Confirmation'];

const Checkout: React.FC<CheckoutProps> = ({
  open,
  onClose,
  items,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    handleNext();
    onSuccess();
  };

  const handlePaymentError = () => {
    // Handle payment error
    console.error('Payment failed');
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {items.map((item) => (
              <Box key={item.product.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{item.product.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price: ${item.product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">
              Total: ${total.toFixed(2)}
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <PayPalScriptProvider options={{ clientId: 'AXtfAEChs-NiPi3ZfaZ0r9kDSGLBpwxWENRY2zohF7c1oAbXzYhNb5ePV02COw-gGckJgxzSt_re5y-O' }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [
                      {
                        amount: {
                          currency_code: 'USD',
                          value: total.toFixed(2),
                        },
                        items: items.map((item) => ({
                          name: item.product.name,
                          unit_amount: {
                            currency_code: 'USD',
                            value: item.product.price.toFixed(2),
                          },
                          quantity: item.quantity.toString(),
                        })),
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  if (actions.order) {
                    await actions.order.capture();
                    handlePaymentSuccess();
                  }
                }}
                onError={handlePaymentError}
                style={{ layout: 'vertical' }}
              />
            </PayPalScriptProvider>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Confirmation
            </Typography>
            <Typography>
              Thank you for your purchase! Your order has been successfully processed.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions>
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        {activeStep === 0 && (
          <Button variant="contained" onClick={handleNext}>
            Proceed to Payment
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Checkout; 