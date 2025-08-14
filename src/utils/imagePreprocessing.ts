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

      // Apply image enhancements for better AI recognition
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Enhance contrast and brightness
      const factor = 1.1; // Slight contrast boost
      const brightness = 5; // Slight brightness boost

      for (let i = 0; i < data.length; i += 4) {
        // Apply contrast and brightness to RGB channels
        data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128 + brightness)); // Red
        data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * factor + 128 + brightness)); // Green
        data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * factor + 128 + brightness)); // Blue
        // Alpha channel remains unchanged
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
