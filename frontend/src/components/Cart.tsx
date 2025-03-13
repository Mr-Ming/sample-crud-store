import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CartItem } from '../types';
import Checkout from './Checkout.tsx';

interface CartProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const Cart: React.FC<CartProps> = ({
  open,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckoutSuccess = () => {
    setCheckoutOpen(false);
    onClose();
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 350, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Shopping Cart
          </Typography>
          <Divider />
          <List>
            {items.map((item) => (
              <ListItem key={item.product.id}>
                <ListItemText
                  primary={item.product.name}
                  secondary={`$${item.product.price.toFixed(2)}`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6">
              Total: ${total.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setCheckoutOpen(true)}
            disabled={items.length === 0}
          >
            Checkout
          </Button>
        </Box>
      </Drawer>

      <Checkout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        onSuccess={handleCheckoutSuccess}
      />
    </>
  );
};

export default Cart; 