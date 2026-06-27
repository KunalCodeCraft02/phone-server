import { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Camera, Scan, Copy, Save } from 'lucide-react';
import { useSaveQRScan } from '../../hooks/useQR';
import Button from '../../components/ui/Button';
import QRHistory from './QRHistory';
import SearchBar from '../../components/shared/SearchBar';
import toast from 'react-hot-toast';

export default function QRScannerPage() {
  const [result, setResult] = useState('');
  const [search, setSearch] = useState('');
  const saveMutation = useSaveQRScan();

  const handleSimulateScan = () => {
    const mockData = [
      'https://example.com/product/123',
      'WIFI:T:WPA;S:MyNetwork;P:password123;;',
      'BEGIN:VCARD\nFN:John Doe\nTEL:+1234567890\nEND:VCARD',
      'https://github.com/user/repo',
      'tel:+1-555-0123',
    ];
    const scanned = mockData[Math.floor(Math.random() * mockData.length)];
    setResult(scanned);
    toast.success('QR code scanned');
  };

  const handleSave = async () => {
    if (!result) return;
    await saveMutation.mutateAsync({ content: result, type: 'qr' });
    setResult('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">QR Scanner</h2>
        <p className="text-slate-400 text-sm">Scan and save QR codes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Scanner</h3>

          <div className="aspect-square max-w-sm mx-auto bg-slate-800/50 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center mb-6">
            <Camera className="h-16 w-16 text-slate-500 mb-4" />
            <p className="text-sm text-slate-400">Camera preview area</p>
            <p className="text-xs text-slate-500 mt-1">Point camera at QR code</p>
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={handleSimulateScan} className="flex-1">
              <Scan className="h-4 w-4" />
              Simulate Scan
            </Button>
          </div>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-xl p-4"
            >
              <p className="text-xs text-slate-400 mb-2">Scan Result:</p>
              <p className="text-sm text-white break-all mb-3">{result}</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} loading={saveMutation.isPending}>
                  <Save className="h-3 w-3" /> Save
                </Button>
                <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Scan History</h3>
          <div className="max-w-md mb-4">
            <SearchBar onSearch={setSearch} placeholder="Search scans..." />
          </div>
          <QRHistory search={search} />
        </div>
      </div>
    </motion.div>
  );
}
