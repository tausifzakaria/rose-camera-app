import { ref } from 'vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media } from '@capacitor-community/media';
import { isPlatform } from '@ionic/vue';

export const useCameraWatermark = () => {
    const isLoading = ref(false);
    const lastPhoto = ref<string | null>(null);

    const addWatermarkToCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Configure watermark styling
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';

        // Line 1: Rose Hosiery (Bebas Neue font - larger)
        ctx.font = 'bold 48px "Bebas Neue", sans-serif';
        ctx.fillText('ROSE HOSIERY', centerX, centerY - 60);
        ctx.strokeText('ROSE HOSIERY', centerX, centerY - 60);

        // Line 2: Address (smaller font)
        ctx.font = '32px Arial, sans-serif';
        ctx.fillText('Add. - Chora street, Gondal', centerX, centerY - 10);
        ctx.strokeText('Add. - Chora street, Gondal', centerX, centerY - 10);

        // Line 3 & 4: Phone numbers
        ctx.fillText('Mo - 7984252064', centerX, centerY + 30);
        ctx.strokeText('Mo - 7984252064', centerX, centerY + 30);

        ctx.fillText('Mo - 9228707403', centerX, centerY + 70);
        ctx.strokeText('Mo - 9228707403', centerX, centerY + 70);
    };

    const captureAndWatermark = async () => {
        try {
            isLoading.value = true;

            // Capture photo
            const photo = await Camera.getPhoto({
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
                quality: 90,
                allowEditing: false,
                saveToGallery: false
            });

            if (!photo.dataUrl) throw new Error('Failed to capture photo');

            // Create image and canvas for watermarking
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = photo.dataUrl!;
            });

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Add watermark
            addWatermarkToCanvas(canvas, ctx);

            // Convert to base64
            const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const base64Data = watermarkedDataUrl.split(',')[1];

            // Save to device storage
            const fileName = `rose_hosiery_${Date.now()}.jpg`;

            if (isPlatform('hybrid')) {
                // Save to temporary location first
                const savedFile = await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: Directory.Cache
                });

                // Save to gallery using Media plugin
                await Media.savePhoto({
                    path: savedFile.uri,
                    fileName: fileName
                });

                // Clean up temporary file
                await Filesystem.deleteFile({
                    path: fileName,
                    directory: Directory.Cache
                });
            } else {
                // Web fallback - trigger download
                const link = document.createElement('a');
                link.download = fileName;
                link.href = watermarkedDataUrl;
                link.click();
            }

            lastPhoto.value = watermarkedDataUrl;
            return watermarkedDataUrl;

        } catch (error) {
            console.error('Camera error:', error);
            throw error;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        captureAndWatermark,
        isLoading,
        lastPhoto
    };
};
