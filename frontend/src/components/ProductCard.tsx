import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onAddToCart,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2">
          {product.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {product.category}
        </Typography>
        <Typography variant="body2" component="p">
          {product.description}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          {product.marketing_blurb && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {product.marketing_blurb}
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<ShoppingCartIcon />}
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit(product)}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(product.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 