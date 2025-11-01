# 💰 KU-Money App

> Frontend aplikasi SaaS (Software as a Service) untuk manajemen keuangan pribadi yang dibangun dengan Vue.js 3

KU-Money adalah aplikasi web modern yang memungkinkan pengguna untuk mengelola keuangan pribadi dengan mudah, mulai dari pencatatan transaksi, manajemen dompet, kategori keuangan, hingga analisis dashboard keuangan yang komprehensif.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technologies](#-technologies)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Build for Production](#-build-for-production)
- [Environment Variables](#-environment-variables)
- [Code Quality](#-code-quality)
- [Architecture](#-architecture)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Authorization

- ✅ User registration dengan email verification
- ✅ Login dengan JWT authentication
- ✅ Email verification dengan token
- ✅ Automatic token refresh
- ✅ Protected routes dengan navigation guards
- ✅ Password update dengan validasi

### 💳 Financial Management

- ✅ **Dashboard Analytics**
  - Ringkasan keuangan (total saldo, pemasukan, pengeluaran)
  - Grafik pengeluaran per kategori
  - Grafik pemasukan vs pengeluaran
  - Transaksi terbaru
  - Filter berdasarkan tanggal dan dompet

- ✅ **Manajemen Dompet (Wallets)**
  - Create, read, update, delete dompet
  - Multiple account types (Bank, E-Wallet, Cash)
  - Balance tracking
  - Limit berdasarkan subscription

- ✅ **Manajemen Kategori**
  - Create, read, update, delete kategori
  - Tipe kategori: Pemasukan (Incomes) & Pengeluaran (Expenses)
  - Icon customization
  - Limit berdasarkan subscription

- ✅ **Pencatatan Transaksi**
  - Create, read, update, delete transaksi
  - Auto-update balance pada dompet
  - Grouping transaksi berdasarkan tanggal
  - Filter berdasarkan kategori, dompet, dan tanggal
  - Navigation bulan (prev/next)

### 📦 Subscription Management

- ✅ Tiga paket subscription:
  - **Free**: 10 kategori, 3 dompet, limit transaksi
  - **Pro**: 50 kategori, 10 dompet, limit lebih besar
  - **Unlimited**: Tidak ada limit
- ✅ Upgrade subscription
- ✅ Perpanjang subscription
- ✅ Expired subscription check
- ✅ Subscription limits enforcement

### 💰 Payment Integration

- ✅ Xendit payment gateway integration
- ✅ Order creation untuk upgrade/extend
- ✅ Payment success/failed handling
- ✅ Order history dengan pagination
- ✅ Order detail modal

### 🎨 User Interface

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Modern UI dengan Tailwind CSS
- ✅ Dark/Light mode support (via DaisyUI)
- ✅ Loading states & error handling
- ✅ SweetAlert2 untuk notifications
- ✅ AOS (Animate On Scroll) untuk landing page
- ✅ Material Design Icons

### 🛡️ Security Features

- ✅ JWT token-based authentication
- ✅ Automatic token refresh
- ✅ Secure HTTP requests dengan axios interceptors
- ✅ CORS configuration untuk production
- ✅ Protected routes dengan verification check
- ✅ Subscription expired check

---

## 🛠 Technologies

### Core Framework

- **[Vue.js 3.5.22](https://vuejs.org/)** - Progressive JavaScript Framework dengan Composition API
- **[Vite 7.1.11](https://vitejs.dev/)** - Next Generation Frontend Build Tool
- **[Vue Router 4.6.3](https://router.vuejs.org/)** - Official Router untuk Vue.js
- **[Pinia 3.0.3](https://pinia.vuejs.org/)** - State Management (Vuex Successor)

### UI & Styling

- **[Tailwind CSS 4.1.16](https://tailwindcss.com/)** - Utility-first CSS framework
- **[DaisyUI 5.3.10](https://daisyui.com/)** - Tailwind CSS component library
- **[PostCSS 8.5.6](https://postcss.org/)** - CSS transformation tool
- **[Autoprefixer 10.4.21](https://autoprefixer.github.io/)** - CSS vendor prefixing

### HTTP & API

- **[Axios 1.12.2](https://axios-http.com/)** - Promise-based HTTP client
- **[Vue Axios 3.5.2](https://github.com/imcvampire/vue-axios)** - Axios integration untuk Vue

### UI Components & Icons

- **[Material Design Icons 7.4.47](https://materialdesignicons.com/)** - 7000+ icons
- **[Iconify Vue 5.0.0](https://iconify.design/)** - 100,000+ icons dari berbagai icon sets
- **[SweetAlert2 11.26.3](https://sweetalert2.github.io/)** - Beautiful alert dialogs
- **[Vue SweetAlert2 5.0.11](https://github.com/avil13/vue-sweetalert2)** - Vue wrapper untuk SweetAlert2

### Utilities

- **[Moment.js 2.30.1](https://momentjs.com/)** - Date manipulation & formatting
- **[AOS 2.3.4](https://michalsnik.github.io/aos/)** - Animate On Scroll library
- **[Vue i18n 11.1.12](https://vue-i18n.intlify.dev/)** - Internationalization plugin
- **[Vue Dragscroll 4.0.6](https://github.com/donnikitos/vue-dragscroll)** - Drag scrolling functionality

### Development Tools

- **[ESLint 9.37.0](https://eslint.org/)** - JavaScript linter
- **[Prettier 3.6.2](https://prettier.io/)** - Code formatter
- **[Vite Plugin Vue DevTools 8.0.3](https://github.com/webfansplz/vite-plugin-vue-devtools)** - Vue DevTools integration
- **[Vue ESLint Config Prettier 10.2.0](https://github.com/vuejs/eslint-config-prettier)** - ESLint + Prettier integration

### Node.js Requirements

- **Node.js**: ^20.19.0 || >=22.12.0

---

## 📦 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** (^20.19.0 atau >=22.12.0)
- **npm** atau **yarn** package manager
- **Git** untuk version control

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd ku-money-app
```

### 2. Install Dependencies

```bash
npm install
```

atau dengan yarn:

```bash
yarn install
```

### 3. Setup Environment Variables

Buat file `.env` di root directory:

```env
VITE_BASE_URL=http://localhost:3000/api
```

Untuk production, ganti dengan URL backend production:

```env
VITE_BASE_URL=https://api.yourdomain.com/api
```

### 4. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## 📁 Project Structure

```
ku-money-app/
├── public/                 # Static assets
│   └── favicon.ico
│
├── src/                    # Source code
│   ├── main.js            # Application entry point
│   ├── App.vue             # Root component
│   │
│   ├── views/              # Vue components & pages
│   │   ├── components/     # Reusable components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   ├── landing/    # Landing page components
│   │   │   ├── pricing/    # Pricing page components
│   │   │   └── ui/         # Generic UI components
│   │   ├── layouts/        # Layout components
│   │   └── pages/          # Page components
│   │       ├── app/        # Protected app pages
│   │       ├── auth/       # Authentication pages
│   │       ├── landing/    # Landing pages
│   │       └── payment/    # Payment callback pages
│   │
│   ├── composables/        # Vue 3 Composables (reusable logic)
│   │   ├── useAuth.js
│   │   ├── useCategories.js
│   │   ├── useDashboardData.js
│   │   ├── useDashboardFilters.js
│   │   ├── useOrders.js
│   │   ├── usePackages.js
│   │   ├── useSettings.js
│   │   ├── useSubscription.js
│   │   ├── useTransactions.js
│   │   └── useWallets.js
│   │
│   ├── services/           # API service layer
│   │   ├── account.service.js
│   │   ├── auth.service.js
│   │   ├── category.service.js
│   │   ├── dashboard.service.js
│   │   ├── order.service.js
│   │   ├── package.service.js
│   │   ├── subscription.service.js
│   │   └── transaction.service.js
│   │
│   ├── stores/              # Pinia stores (state management)
│   │   ├── auth.js          # Authentication state
│   │   ├── loading.js       # Global loading state
│   │   └── counter.js       # Example store
│   │
│   ├── plugins/             # Vue plugins & extensions
│   │   ├── axios.js         # Axios instance & interceptors
│   │   ├── i18n.js          # Internationalization
│   │   └── swal.js          # SweetAlert2 configuration
│   │
│   ├── routes/              # Vue Router configuration
│   │   └── index.js         # Route definitions & guards
│   │
│   ├── helpers/              # Utility functions
│   │   ├── dateFormat.js    # Date formatting helpers
│   │   ├── formatCurrency.js # Currency formatting (Rupiah)
│   │   └── walletIcons.js    # Wallet icon mappings
│   │
│   └── styles/              # Global styles
│       └── index.css        # Tailwind directives & custom styles
│
├── .env                     # Environment variables (not in repo)
├── .gitignore               # Git ignore rules
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML entry point
├── jsconfig.json            # JavaScript project config
├── package.json             # Dependencies & scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

### Folder Description

- **`views/`** - Semua Vue components (pages, layouts, reusable components)
- **`composables/`** - Reusable business logic menggunakan Vue Composition API
- **`services/`** - API service layer untuk komunikasi dengan backend
- **`stores/`** - Global state management menggunakan Pinia
- **`plugins/`** - Vue plugins dan konfigurasi (axios, i18n, swal)
- **`routes/`** - Vue Router configuration dan navigation guards
- **`helpers/`** - Utility functions dan helper functions
- **`styles/`** - Global CSS dan Tailwind directives

---

## 💻 Development

### Development Server

```bash
npm run dev
```

- Server akan berjalan di `http://localhost:3000`
- Hot Module Replacement (HMR) enabled
- Vue DevTools enabled

### Available Scripts

```bash
# Development
npm run dev              # Start development server

# Build
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint and fix issues
npm run format          # Format code with Prettier
```

### Code Style

Proyek ini menggunakan:

- **ESLint** untuk linting
- **Prettier** untuk code formatting
- **Vue 3 Composition API** style
- **JavaScript ES6+** syntax

---

## 🏗 Build for Production

### Build Command

```bash
npm run build
```

Build output akan berada di folder `dist/` yang siap untuk di-deploy ke production server.

### Preview Production Build

```bash
npm run preview
```

Untuk preview build production secara lokal sebelum deploy.

### Production Deployment

1. Set environment variable `VITE_BASE_URL` dengan URL backend production
2. Build aplikasi: `npm run build`
3. Deploy folder `dist/` ke hosting (Vercel, Netlify, dll)
4. Pastikan backend sudah di-deploy dan accessible

---

## 🔧 Environment Variables

Buat file `.env` di root directory:

```env
# Backend API URL
VITE_BASE_URL=http://localhost:3000/api
```

### Environment Variables List

| Variable        | Description          | Example                     |
| --------------- | -------------------- | --------------------------- |
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |

**Note**: Semua environment variables di Vite harus memiliki prefix `VITE_` untuk bisa diakses di frontend.

---

## ✨ Code Quality

### Linting

```bash
npm run lint
```

ESLint akan:

- Check code quality
- Auto-fix issues jika memungkinkan
- Cache results untuk performance

### Formatting

```bash
npm run format
```

Prettier akan:

- Format semua file di folder `src/`
- Consistent code style
- Auto-format on save (jika dikonfigurasi di editor)

---

## 🏛 Architecture

### Architecture Pattern

Aplikasi menggunakan **layered architecture**:

```
Presentation Layer (Vue Components)
         ↓
Business Logic Layer (Composables)
         ↓
Service Layer (API Services)
         ↓
HTTP Client Layer (Axios)
         ↓
State Management (Pinia)
         ↓
Backend API
```

### Key Patterns

1. **Composition API Pattern** - Reusable logic di composables
2. **Service Layer Pattern** - API calls terpisah dari business logic
3. **Store Pattern** - Global state dengan Pinia
4. **Component-based Architecture** - Modular dan reusable components

### Data Flow

1. User action → Component event
2. Component → Composable function
3. Composable → Service function
4. Service → Axios HTTP request
5. Response → Composable updates state
6. Component re-renders

---

## 📚 Additional Documentation

Untuk dokumentasi lebih lengkap, lihat:

- **[APP-DOCUMENTATION.txt](./APP-DOCUMENTATION.txt)** - Dokumentasi lengkap aplikasi termasuk:
  - Detail struktur folder
  - Alur setiap fitur
  - Arsitektur aplikasi
  - API integration
  - Composables pattern
  - Dan lainnya

---

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Token Refresh** - Automatic token refresh mechanism
- **CORS Configuration** - Proper CORS setup untuk production
- **Protected Routes** - Navigation guards untuk protected pages
- **Email Verification** - Required untuk akses protected routes
- **Subscription Limits** - Enforced pada backend

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

Proyek ini menggunakan [MIT License](https://choosealicense.com/licenses/mit/).

---

## 👨‍💻 Author

**KU-Money Development Team**

- Frontend: Vue.js 3 + Vite
- Backend: Node.js + Express.js
- Database: MongoDB

---

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - Progressive JavaScript Framework
- [Vite](https://vitejs.dev/) - Next Generation Frontend Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Pinia](https://pinia.vuejs.org/) - State Management
- [Axios](https://axios-http.com/) - HTTP Client
- Dan semua library open source lainnya yang digunakan

---

## 📞 Support

Jika ada pertanyaan atau issues:

- Buka issue di repository
- Email: support@kumoney.com

---

**Made with ❤️ for personal finance management**
