# Personal Device Cloud

A full-stack MERN + Capacitor application that transforms your Android phone into a personal cloud server and automation hub.

## Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, React Query, Socket.io Client, Capacitor  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Auth, Socket.io, Cloudinary  
**Database:** MongoDB Atlas  
**Media Storage:** Cloudinary  

## Features

- **Dashboard** — Real-time stats, activity timeline, device monitoring
- **Camera Auto Upload** — Photos compress and sync to cloud instantly
- **SMS Gateway** — Send, receive, and manage SMS from the dashboard
- **GPS Tracking** — Live location tracking with travel history
- **Contacts Backup** — Sync, search, edit, export contacts as CSV
- **Clipboard Sync** — Cross-device clipboard with copy-back support
- **File Transfer** — Upload, download, manage files with folder support
- **QR Code Scanner** — Scan and store QR codes with location data
- **Barcode Scanner** — Scan barcodes with format detection
- **Device Management** — Monitor connected devices, battery, storage
- **Real-time Updates** — Socket.io powered instant sync across all features

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)
- Android Studio (for APK build)

## Installation

### 1. Clone and install

```bash
git clone <repo-url>
cd personal-device-cloud
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### 3. Frontend setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

### 4. Android build (optional)

```bash
cd client
npm run build
npx cap sync android
npx cap open android
```

## Environment Variables

### Server (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devicecloud
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:5173
```

### Client (.env)

```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh | Refresh token |
| PUT | /api/auth/change-password | Change password |
| GET | /api/auth/profile | Get profile |
| PUT | /api/auth/profile | Update profile |

### Photos
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/photos/upload | Upload photo |
| GET | /api/photos | List photos (paginated) |
| GET | /api/photos/:id | Get photo |
| DELETE | /api/photos/:id | Delete photo |

### SMS
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/sms/send | Send SMS |
| GET | /api/sms | List SMS (paginated, filterable) |
| DELETE | /api/sms/:id | Delete SMS |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contacts/sync | Bulk sync contacts |
| GET | /api/contacts | List contacts |
| PUT | /api/contacts/:id | Update contact |
| DELETE | /api/contacts/:id | Delete contact |
| GET | /api/contacts/export/csv | Export as CSV |

### Clipboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/clipboard/sync | Sync clipboard |
| GET | /api/clipboard | List clipboard items |
| DELETE | /api/clipboard/:id | Delete item |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/files/upload | Upload file |
| GET | /api/files | List files |
| GET | /api/files/:id/download | Download file |
| DELETE | /api/files/:id | Delete file |

### QR Code
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/qr/scan | Save QR scan |
| GET | /api/qr | History |
| DELETE | /api/qr/:id | Delete |

### Barcode
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/barcode/scan | Save barcode scan |
| GET | /api/barcode | History |
| DELETE | /api/barcode/:id | Delete |

### Devices
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/devices/register | Register device |
| GET | /api/devices | List devices |
| PUT | /api/devices/:id | Update device |
| DELETE | /api/devices/:id | Remove device |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/dashboard/stats | Dashboard stats |
| GET | /api/dashboard/activity | Recent activity |

## Project Structure

```
personal-device-cloud/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── uploads/
│   ├── validators/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── shared/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── capacitor.config.ts
│   ├── package.json
│   └── vite.config.js
└── docs/
```

## Deployment

### Frontend (Vercel)

```bash
cd client
npm run build
vercel --prod
```

### Backend (Railway/VPS)

```bash
cd server
npm start
```

### Database

Use MongoDB Atlas free tier for production.

## License

MIT
