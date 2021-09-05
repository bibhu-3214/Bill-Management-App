import { MenuItem, Select } from '@material-ui/core';

const SelectCustomer = ({
   ids,
   names,
   customerId,
   setCustomerId,
   customers,
}) => {
   return (
      <>
         <Select
            variant="outlined"
            id="customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            style={{ height: '40px', width: '30%' }}
         >
            <MenuItem>{names}</MenuItem>
         </Select>
      </>
   );
};

export default SelectCustomer;
