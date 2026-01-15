'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Button from './Button';
import { FiTrash2, FiCheck } from 'react-icons/fi';

interface SignaturePadProps {
    onSave: (signature: string) => void;
    onClear?: () => void;
}

export default function SignaturePad({ onSave, onClear }: SignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const clear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
        if (onClear) onClear();
    };

    const save = () => {
        if (!sigCanvas.current?.isEmpty()) {
            const dataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
            if (dataUrl) {
                onSave(dataUrl);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden min-h-[200px]">
                <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{
                        className: 'signature-canvas w-full h-full min-h-[200px]',
                    }}
                    onBegin={() => setIsEmpty(false)}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clear}
                    leftIcon={<FiTrash2 />}
                >
                    Limpar
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={save}
                    disabled={isEmpty}
                    leftIcon={<FiCheck />}
                >
                    Confirmar Assinatura
                </Button>
            </div>
        </div>
    );
}
