import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScanBarcode, Camera, Scan, Copy, Save } from 'lucide-react';
import { useSaveBarcodeScan } from '../../hooks/useBarcode';
import Button from '../../components/ui/Button';
import BarcodeHistory from './BarcodeHistory';
import SearchBar from '../../components/shared/SearchBar';
import toast from 'react-hot-toast';

export default function BarcodeScannerPage() {
  const [result, setResult] = useState('');
  const [format, setFormat] = useState('');
  const [search, setSearch] = useState('');
  const saveMutation = useSaveBarcodeScan();

  const handleSimulateScan = () => {
    const formats = ['EAN-13', 'UPC-A', 'Code 128', 'QR', 'Code 39'];
    const codes = ['5901234123457', '0123456789012', 'ABC-1234-5678', '4829301745623', 'XY-9876-5432'];
    const idx = Math.floor(Math.random() * codes.length);
    setResult(codes[idx]);
    setFormat(formats[idx]);
    toast.success('Barcode scanned');
  };

  const handleSave = async () => {
    if (!result) return;
    await saveMutation.mutateAsync({ code: result, format, content: result, type: 'barcode' });
    setResult('');
    setFormat('');
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
        <h2 className="text-2xl font-bold text-slate-800">Barcode Scanner</h2>
        <p className="text-slate-500 text-sm">Scan and save barcodes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg shadow-slate-200/40">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Scanner</h3>

          <div className="aspect-square max-w-sm mx-auto bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center mb-6">
            <Camera className="h-16 w-16 text-slate-400 mb-4" />
            <p className="text-sm text-slate-500">Camera preview area</p>
            <p className="text-xs text-slate-400 mt-1">Point camera at barcode</p>
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
              className="bg-slate-50 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs text-slate-500">Scan Result:</p>
                {format && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{format}</span>
                )}
              </div>
              <p className="text-sm text-slate-800 font-mono mb-3">{result}</p>
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
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Scan History</h3>
          <div className="max-w-md mb-4">
            <SearchBar onSearch={setSearch} placeholder="Search barcodes..." />
          </div>
          <BarcodeHistory search={search} />
        </div>
      </div>
    </motion.div>
  );
}
