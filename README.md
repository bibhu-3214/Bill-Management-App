# BILL MANAGEMENT APP

A web application where users can Register and
Login, After Login Authenticated users will be able to Add, Update or Delete the details of
customers, products and bill.

## Local development

```bash
yarn install
yarn start
```

This is a frontend-only application. Accounts and workspace records are stored
locally in the current browser, so no API server or environment configuration is
required. Workspaces are encrypted with AES-GCM using a key derived from the
account password with PBKDF2. Sessions expire after eight hours and are cleared
when the browser tab session ends. Clearing browser storage removes the locally
saved data.

Because there is no trusted server, this local security model cannot protect data
from someone who controls the browser profile or from malicious code executing in
the page. Use a server-backed identity and database before handling real financial
or customer data in production.

Run the automated checks with `yarn test --watchAll=false` and create a production
bundle with `yarn build`.


### 🛠 Tech Stack

- 💻 JavaScript | ES6
- 🌐 ReactJS | Redux | Redux-thunk | React Router | Local browser storage
- 🔧 Git | Markdown
- 📦 [Material-UI](https://github.com/mui-org/material-ui), [redux](https://github.com/reduxjs/redux), [react-router-dom](https://www.npmjs.com/package/react-router-dom), [sweetalert](https://sweetalert.js.org/), [formik](https://formik.org/), [redux-thunk](https://github.com/reduxjs/redux-thunk), [yup](https://github.com/jquense/yup)


### Features

- Authentication.
  - User must signup and signin to verify their identity to use the application.
  - JWT used for authentication.
- Admin Tab 
  - Authenticated users can see the their details like name, email, businessName and address.
  - They can also see the total customers, total products and total bills length 
- Customers Tab
  - Authenticated users can perform CRUD operations on customers.
  - Search functionality is used to search customers by their names.
- Products Tab
  - Authenticated users can perform CRUD operations on Products.
  - Search functionality is used to search customers by their names.
- Bill Tab
  - Authenticated users can add customers, products, products quantity and can delete the data before generating the bill.
  - After bill generation user will be able to see the details of the bills like customer name, total products, quantity of the products, purchased date and total amount. 
