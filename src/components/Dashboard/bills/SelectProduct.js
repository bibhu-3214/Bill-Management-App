import { Button, MenuItem, Select } from '@material-ui/core';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

const SelectProduct = ({
   prodIds,
   prodNames,
   quantity,
   productId,
   setProductId,
}) => {
   return (
      <>
         <Select
            variant="outlined"
            id="product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={{ height: '40px', width: '30%' }}
         >
            <MenuItem value={prodIds}>{prodNames}</MenuItem>
         </Select>
         <Button color="primary">
            <RemoveCircleRoundedIcon />
         </Button>
         <Button color="primary">
            <AddCircleRoundedIcon />
         </Button>
         <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ margin: '10px' }}
         >
            Add
         </Button>
      </>
   );
};

export default SelectProduct;
