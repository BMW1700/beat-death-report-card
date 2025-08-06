import { BrowserMultiFormatReader, Result } from '@zxing/library';

export class BarcodeScanner {
  private codeReader: BrowserMultiFormatReader;
  private isScanning: boolean = false;

  constructor() {
    this.codeReader = new BrowserMultiFormatReader();
  }

  async startScanning(
    videoElement: HTMLVideoElement,
    onResult: (result: string) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (this.isScanning) return;

    try {
      this.isScanning = true;
      
      const devices = await this.codeReader.listVideoInputDevices();
      const deviceId = devices[0]?.deviceId;

      if (!deviceId) {
        throw new Error('No camera device found');
      }

      await this.codeReader.decodeFromVideoDevice(
        deviceId,
        videoElement,
        (result: Result | null, error?: Error) => {
          if (result) {
            onResult(result.getText());
          }
          if (error && this.isScanning) {
            onError(error);
          }
        }
      );
    } catch (error) {
      this.isScanning = false;
      onError(error as Error);
    }
  }

  stopScanning(): void {
    if (this.isScanning) {
      this.codeReader.reset();
      this.isScanning = false;
    }
  }

  isCurrentlyScanning(): boolean {
    return this.isScanning;
  }
}

export const barcodeScanner = new BarcodeScanner();