export const API_BASE_URL = '/api';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  PHOTOS: '/photos',
  SMS: '/sms',
  CONTACTS: '/contacts',
  CLIPBOARD: '/clipboard',
  FILES: '/files',
  QR: '/qr',
  BARCODE: '/barcode',
  LOCATION: '/location',
  DEVICES: '/devices',
  SETTINGS: '/settings',
};

export const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: ROUTES.PHOTOS, label: 'Photos', icon: 'Image' },
  { path: ROUTES.SMS, label: 'SMS', icon: 'MessageSquare' },
  { path: ROUTES.CONTACTS, label: 'Contacts', icon: 'Users' },
  { path: ROUTES.CLIPBOARD, label: 'Clipboard', icon: 'Clipboard' },
  { path: ROUTES.FILES, label: 'Files', icon: 'FolderOpen' },
  { path: ROUTES.QR, label: 'QR Scanner', icon: 'QrCode' },
  { path: ROUTES.BARCODE, label: 'Barcode', icon: 'ScanBarcode' },
  { path: ROUTES.LOCATION, label: 'Location', icon: 'MapPin' },
  { path: ROUTES.DEVICES, label: 'Devices', icon: 'Smartphone' },
  { path: ROUTES.SETTINGS, label: 'Settings', icon: 'Settings' },
];

export const QUERY_KEYS = {
  DASHBOARD: ['dashboard'],
  STATS: ['stats'],
  ACTIVITY: ['activity'],
  PHOTOS: ['photos'],
  SMS: ['sms'],
  CONTACTS: ['contacts'],
  CLIPBOARD: ['clipboard'],
  FILES: ['files'],
  QR: ['qr'],
  BARCODE: ['barcode'],
  LOCATION: ['location'],
  DEVICES: ['devices'],
  PROFILE: ['profile'],
};

export const FILE_TYPE_ICONS = {
  image: 'Image',
  video: 'Film',
  audio: 'Music',
  document: 'FileText',
  archive: 'Archive',
  code: 'Code',
  other: 'File',
};
