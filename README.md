# Forum Discussion App

Aplikasi Forum Diskusi yang dibangun dengan React, Redux Toolkit, dan React Router.

## Fitur

- Authentication (Login & Register)
- Thread Management (Create, Read, Vote)
- Comment System dengan voting
- Leaderboard
- Filter Thread berdasarkan kategori

## Tech Stack

- React 19
- Redux Toolkit
- React Router
- React Hook Form (React Ecosystem)
- Jest & React Testing Library
- Cypress

## Testing

### Unit & Integration Tests

Jalankan unit tests dengan:

```bash
npm test
```

Test coverage mencakup:
- Reducer tests (authSlice, threadsSlice)
- Thunk function tests (loginUser, fetchThreads, fetchThreadDetail, getOwnProfile)
- Component tests (Navbar, ThreadCard, LoginPage)

### End-to-End Tests

Jalankan E2E tests dengan Cypress:

```bash
# Open Cypress UI
npm run e2e

# Run headless
npm run e2e:headless
```

## CI/CD

### GitHub Actions

CI workflow akan otomatis berjalan pada:
- Push ke branch main/master
- Pull request ke branch main/master

Workflow akan:
1. Install dependencies
2. Run linter
3. Run unit tests dengan coverage
4. Build aplikasi

### Vercel Deployment

Aplikasi dikonfigurasi untuk deployment otomatis ke Vercel melalui GitHub integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm start
```

3. Build untuk production:
```bash
npm run build
```

## Testing Coverage

Untuk melihat test coverage:
```bash
npm test -- --coverage
```

## Branch Protection

Untuk memenuhi kriteria submission, branch master/main harus dilindungi dengan:
- Require status checks to pass before merging
- Require CI check to pass
- Require pull request reviews (opsional)

## Screenshots untuk Submission

Pastikan untuk menyimpan screenshot berikut dalam folder `screenshots/` sebelum membuat ZIP submission:
- `1_ci_check_error.jpeg` - Screenshot yang menunjukkan CI check error karena pengujian gagal
- `2_ci_check_pass.jpeg` - Screenshot yang menunjukkan CI check pass karena pengujian lolos
- `3_branch_protection.jpeg` - Screenshot yang menunjukkan branch protection pada halaman PR

### Cara Mendapatkan Screenshot:

1. **CI Check Error**: Buat commit yang menyebabkan test gagal, lalu screenshot status check yang error di GitHub
2. **CI Check Pass**: Perbaiki error, commit ulang, lalu screenshot status check yang pass
3. **Branch Protection**: Pergi ke Settings > Branches > Add rule untuk master/main, lalu screenshot halaman PR yang menunjukkan branch protection aktif

## Struktur Proyek untuk Submission

Saat membuat ZIP untuk submission:
1. Hapus folder `node_modules`
2. Tambahkan folder `screenshots` dengan 3 screenshot di atas
3. Pastikan semua test bisa dijalankan dengan `npm test` dan `npm run e2e`

