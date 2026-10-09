# BillFlow

**A secure, frontend-only billing workspace for managing customers, products, and invoices.**

BillFlow brings the core billing workflow into one focused dashboard. Create a local business workspace, maintain a searchable customer and product catalog, generate invoices, monitor revenue, and export polished PDFs—all without configuring an API or database.

> [!IMPORTANT]
> BillFlow stores its data in the current browser. It is designed for demonstrations, prototypes, and personal local use—not for production financial or customer data.

## Highlights

| Area | Capabilities |
| --- | --- |
| Overview | Revenue summary, operational metrics, recent activity, and a six-month sales chart |
| Customers | Create, search, update, and remove customer records |
| Products | Maintain a searchable catalog with names and prices |
| Invoices | Build line-item invoices, calculate totals, review history, and download A4 PDFs |
| Experience | Responsive Material UI interface, focused empty states, dialogs, notifications, and motion |
| Data integrity | Prevents customers or products referenced by an invoice from being deleted |

## Indian invoicing workflow

### Daily operations workspace

- **Customer and catalog studios:** sectioned editors with live previews, inline validation, save-state feedback and unsaved-change confirmation. Failed saves retain your entries. Customer profiles store company/contact details, billing address, state, GSTIN and internal notes; selecting a customer prefills invoice billing defaults. Catalog items support SKU, category and an internal description alongside pricing/tax defaults. Internal notes and descriptions are not printed on invoices.

- **Collections:** receivables aging, balances due in the next seven days, and a queue prioritised by overdue days and outstanding amount. Missing due dates appear in a separate bucket rather than being treated as overdue.
- **Reminder drafts:** review and edit a payment message, then copy it to your chosen channel. BillFlow never sends reminders automatically and does not record a draft as a delivered message.
- **Invoice workspace:** status counts, customer/number search, issue-date range, due-date/balance sorting, pagination and filtered balance totals.
- **Customer accounts:** click a customer name to see lifetime invoiced value, outstanding/overdue balances, invoice history and a preselected account statement. Cancelled/credited invoices remain in history but are excluded from invoice-value totals.
- **Quick search:** press `Ctrl+K` or `⌘K` to find pages, customers and invoices. Use Tab to select a result or Enter to open the first match.

All insights use the records in this browser. Collections are not bank reconciliation or a cash-flow forecast. Multi-user roles, automatic reminder delivery, inventory movements, purchase accounting and recurring billing are not implemented.

Open **Invoices → Create invoice** to issue a domestic invoice with a financial-year number such as `BF/2627/000001`. Add quantities, units, line discounts, a due date and payment terms. For a GST-registered supplier, enable GST, provide the supplier GSTIN and state, confirm the place of supply, and enter each item's HSN/SAC and tax rate.

- Tax-exclusive calculations apply discounts before GST and round each tax component to paise. Same-state supplies split CGST and SGST/UTGST; interstate supplies use IGST.
- GSTIN validation checks syntax, state code and checksum; it does not verify registration status with GSTN. Rates and HSN/SAC classifications must be confirmed by the business.
- New invoices retain customer, supplier and product snapshots. Editing the catalog cannot change those issued details. Legacy invoices remain readable but cannot gain historical snapshots retroactively.
- Record partial or full payments by UPI, bank transfer, cash, card or cheque. These are manual records, not bank verification or payment collection. Search by customer or invoice number and filter unpaid, partial, overdue or paid invoices.
- Configure **Business settings** with your business identity, logo, GSTIN, state, payment instructions, default terms and payment period. Product records can retain HSN/SAC, GST rate and unit defaults; existing invoices retain their original snapshots.
- Issued invoices and payment records cannot be deleted. Invoice details now support cancellation, payment-record reversal and numbered full-invoice credit notes, each retaining the reason, date and user. Cancellation and credit require no active payments. These records do not process refunds or submit GST adjustments; partial credit notes are not supported.
- Open **Customers → Customer statements** for an account ledger of invoices, payments and corrections, with a running balance and PDF export. Cancelled and fully credited invoices are excluded from sales totals.

These features remain frontend-only and browser-local. They are not a tamper-proof audit trail or shared accounting ledger. Clearing browser data without a saved backup can permanently remove records. Use a backend, tested backup procedures and a professional tax review before relying on BillFlow for live business operations.

### Backup and recovery

1. Open **Business settings → Download encrypted backup**. Confirm the JSON file was actually saved and keep a copy outside browser storage, preferably on another device or trusted storage service.
2. Keep the account password used at export time. The backup includes encrypted account identity and workspace records, settings, invoice sequences, payments and corrections—not an active session. There is no password recovery.
3. In a separate browser profile, open **Sign in → Recover from an encrypted backup**, select the file and enter that password. Verify the business, backup timestamp and record counts, type `RESTORE`, then sign in normally.

Recovery never merges with or overwrites an existing account. It restores only the saved snapshot; later transactions are not recovered. Do not continue invoicing from both the original and recovered copies because their local number sequences can overlap. Backups are manual, not cloud sync, and anyone with both the file and password can decrypt them. Test recovery periodically before relying on a backup.

This is a domestic invoicing foundation, not a complete GST compliance or filing system. It does not support exports, SEZ, reverse charge, cess, composition schemes, bills of supply, e-invoice IRN/QR registration or e-way bills. The GST workflow assumes billing and delivery addresses are the same. The PDF has an authorised-signatory area but does not apply a digital signature. Number sequences are local to each browser workspace, not centrally coordinated across devices.

Invoice fields are informed by [CBIC invoice rules](https://cbic-gst.gov.in/gst-invoice-rules.html). Applicability, tax classifications and issuance requirements need review before production use.

## Local security model

Each account receives an isolated, encrypted workspace in browser storage:

- Workspace records are encrypted with **AES-GCM**.
- Encryption keys are derived from the account password using **PBKDF2-SHA-256** with a unique salt and 310,000 iterations.
- Active credentials are kept in `sessionStorage`, expire after eight hours, and are removed when the browser session ends.
- Repeated failed sign-in attempts trigger a temporary five-minute lockout.
- Registration enforces a minimum 12-character password with uppercase, lowercase, number, and symbol requirements.
- Legacy local records are migrated into the encrypted format after successful authentication.

This model protects stored workspace contents from casual inspection, but a frontend-only application cannot provide the guarantees of a trusted server. Anyone controlling the browser profile—or malicious code running on the page—may still access application data while a session is active. Use server-backed authentication, authorization, secure cookies, audit logging, and a managed database before handling real business data.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### Run locally

```bash
git clone https://github.com/bibhu-3214/Bill-Management-App.git
cd Bill-Management-App
yarn install
yarn start
```

Open [http://localhost:3000](http://localhost:3000), create an account, and start building your workspace. No API keys, backend service, or environment variables are required.

## Available commands

| Command | Purpose |
| --- | --- |
| `yarn start` | Start the development server |
| `yarn test --watchAll=false` | Run the automated test suite once |
| `yarn build` | Create an optimized production bundle |

## Technology

- **Application:** React 17, React Router, Redux, Redux Thunk
- **Interface:** Material UI, custom responsive CSS, CSS animations
- **Forms:** Formik and Yup
- **Dates:** date-fns and Moment.js
- **Documents:** KendoReact PDF Export
- **Persistence:** Web Crypto API, `localStorage`, and `sessionStorage`
- **Testing:** Jest and React Testing Library

## Project structure

```text
src/
├── components/
│   ├── Authentication/       # Landing, registration, and sign-in
│   └── Dashboard/            # Overview, customers, products, and invoices
├── data/
│   └── localData.js          # Encrypted browser persistence and sessions
├── Redux/
│   ├── Actions/              # Async application operations
│   └── Reducers/             # Domain state management
├── helper/                   # Protected route components
├── utils/                    # Billing and reporting utilities
├── App.js                    # Application routes
├── index.css                 # Global design system and motion
└── theme.js                  # Material UI theme configuration
```

## Data and privacy

- Data stays in the browser profile where it was created.
- Accounts created in one browser or device are not available in another.
- Clearing site data permanently removes local accounts and workspaces.
- There is no password recovery because BillFlow has no server or external identity provider.
- Export important invoices before clearing browser storage.

## Quality checks

Before submitting changes, run:

```bash
yarn test --watchAll=false
yarn build
```

The current test suite covers encrypted local persistence, Redux state transitions, and billing calculations.

## Roadmap

- Server-backed authentication and multi-device synchronization
- Role-based workspace access
- Credit notes, cancellations, payment reversals and broader GST workflows
- Import and export for customer and product data
- Expanded accessibility and end-to-end testing

## Contributing

Contributions are welcome. Fork the repository, create a focused branch, verify the test and production builds, and open a pull request with a concise description of the change.

## Disclaimer

BillFlow is provided as a demonstration project. Validate all calculations and apply the security, compliance, backup, and retention controls required by your organization before using billing software in production.

## Sample workspace and project documentation

## Interface preview

Actual screenshots from the local production build using fictional demo data.

![BillFlow sample dashboard](docs/screenshots/dashboard.jpg)

<details>
<summary>Invoice workspace and mobile layout</summary>

![Invoice workspace](docs/screenshots/invoices.jpg)
<img src="docs/screenshots/mobile.jpg" alt="BillFlow mobile dashboard" width="320" />

</details>

## Explore in two minutes

1. Run the app locally using the commands below.
2. Choose **Explore live demo**. The app opens a fictional workspace with three customers, four products and six invoices.
3. Open **Customers**, **Products** and **Invoices**. Create an invoice and inspect its details.
4. Sign out and reopen the demo to reset the sample data.

Demo changes are isolated to the current browser tab's session. Existing local accounts remain separate. To explore persistence, create a local account instead.


[Architecture & trade-offs](docs/ARCHITECTURE.md) · [Validation history](docs/VALIDATION.md) · [Quality workflow](.github/workflows/quality.yml) · [Deployment guide](docs/DEPLOYMENT.md)

The screenshots and validation history describe the earlier portfolio baseline. This branch uses React Scripts 5 and the expanded billing workflows described above.
