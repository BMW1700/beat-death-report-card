export const preprocessImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Optimal size for AI analysis (balance between quality and speed)
      const maxSize = 1024;
      let { width, height } = img;

      // Resize if too large
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        resolve(file);
        return;
      }

      // Draw and enhance image
      ctx.drawImage(img, 0, 0, width, height);

      // Advanced AI-optimized image enhancement
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Calculate adaptive enhancement parameters
      let avgBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        avgBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      avgBrightness /= (data.length / 4);

      // Adaptive contrast and brightness based on image analysis
      const contrastFactor = avgBrightness < 100 ? 1.3 : avgBrightness > 180 ? 1.1 : 1.2;
      const brightnessAdjust = avgBrightness < 100 ? 15 : avgBrightness > 180 ? -10 : 5;

      // Apply advanced enhancements
      for (let i = 0; i < data.length; i += 4) {
        // Enhanced contrast and brightness with AI-optimized parameters
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * contrastFactor + 128 + brightnessAdjust)); // Red
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * contrastFactor + 128 + brightnessAdjust)); // Green
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * contrastFactor + 128 + brightnessAdjust)); // Blue
        
        // Sharpen edges for better object detection
        if (i > width * 4 && i < data.length - width * 4) {
          const sharpness = 0.15;
          const centerWeight = 1 + 4 * sharpness;
          const neighborWeight = -sharpness;
          
          // Sharpen each color channel
          for (let c = 0; c < 3; c++) {
            const center = data[i + c];
            const top = data[i - width * 4 + c];
            const bottom = data[i + width * 4 + c];
            const left = data[i - 4 + c];
            const right = data[i + 4 + c];
            
            data[i + c] = Math.min(255, Math.max(0,
              center * centerWeight +
              top * neighborWeight +
              bottom * neighborWeight +
              left * neighborWeight +
              right * neighborWeight
            ));
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Convert back to file
      canvas.toBlob((blob) => {
        if (blob) {
          const enhancedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(enhancedFile);
        } else {
          resolve(file);
        }
      }, 'image/jpeg', 0.9);
    };

    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageForAI = (file: File): Promise<{
  isValid: boolean;
  score: number;
  issues: string[];
  recommendations: string[];
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const issues: string[] = [];
      const recommendations: string[] = [];
      let score = 100;

      // Check resolution
      if (img.width < 400 || img.height < 300) {
        issues.push('Low resolution detected');
        recommendations.push('Use higher resolution image (800x600 or larger)');
        score -= 30;
      }

      // Check aspect ratio
      const aspectRatio = img.width / img.height;
      if (aspectRatio > 3 || aspectRatio < 0.33) {
        issues.push('Unusual aspect ratio');
        recommendations.push('Use images with standard aspect ratios (1:1 to 16:9)');
        score -= 15;
      }

      // Check file size vs resolution (compression quality indicator)
      const bytesPerPixel = file.size / (img.width * img.height);
      if (bytesPerPixel < 0.1) {
        issues.push('Heavy compression detected');
        recommendations.push('Use less compressed images for better detail');
        score -= 20;
      }

      resolve({
        isValid: score >= 50,
        score: Math.max(0, score),
        issues,
        recommendations
      });
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        score: 0,
        issues: ['Invalid image format'],
        recommendations: ['Use a valid image format (JPG, PNG, WEBP)']
      });
    };

    img.src = URL.createObjectURL(file);
  });
};
