import React, { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';

interface PhotoVerificationModalProps {
  patchId: string;
  patchName: string;
  crewId: string;
  onVerified: () => void;
  onClose: () => void;
}

export const PhotoVerificationModal: React.FC<PhotoVerificationModalProps> = ({
  patchId,
  patchName,
  crewId,
  onVerified,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [payoutInfo, setPayoutInfo] = useState<{ amount: number; hash: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleVerify = async () => {
    if (!selectedFile) return;
    setIsVerifying(true);
    setResultMessage(null);

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('patch_id', patchId);
    formData.append('crew_id', crewId);

    try {
      const resp = await fetch('/api/v1/verify/photo', {
        method: 'POST',
        body: formData,
      });

      const data = await resp.json();
      if (data.verified) {
        setResultMessage(data.message);
        setPayoutInfo({ amount: data.staged_payout_inr, hash: data.tx_hash });
        onVerified();
      } else {
        setResultMessage(data.message || 'Verification rejected: Location outside designated patch.');
      }
    } catch (e) {
      setResultMessage('Photo verification failed due to network error.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">Field Photo Geotag Verification</h3>
            <span className="text-[10px] text-slate-400">Target: {patchName}</span>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer transition">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            id="photo-input"
          />
          <label htmlFor="photo-input" className="cursor-pointer block">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg object-cover"
              />
            ) : (
              <div className="space-y-2 py-4">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs text-slate-300 font-medium">
                  Tap to snap or select geotagged field photo
                </div>
                <div className="text-[10px] text-slate-500">
                  EXIF GPS coordinates will be matched against satellite patch boundaries
                </div>
              </div>
            )}
          </label>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleVerify}
            disabled={!selectedFile || isVerifying}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            {isVerifying ? 'Verifying EXIF & Revisit...' : 'Verify Harvest & Release Wage'}
          </button>
        </div>

        {/* Result Feedback */}
        {resultMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              payoutInfo
                ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-600/40 text-rose-300'
            }`}
          >
            {payoutInfo ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 text-rose-400 shrink-0" />
            )}
            <div>
              <p className="font-semibold">{resultMessage}</p>
              {payoutInfo && (
                <div className="mt-1 pt-1 border-t border-emerald-600/30 text-[11px]">
                  <span>Wage Released: <b>₹{payoutInfo.amount.toFixed(2)}</b></span>
                  <span className="block font-mono text-[9px] text-slate-400 mt-0.5">
                    Tx: {payoutInfo.hash.slice(0, 20)}...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
