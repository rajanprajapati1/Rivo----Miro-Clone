import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';
import * as fabric from 'fabric';
import useStore from '../store/useStore';

/**
 * Remove background from selected image using @imgly/background-removal
 * 100% client-side processing - no server required
 */
export const removeImageBackground = async (canvas) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') {
        console.warn('Please select an image first');
        return;
    }

    const store = useStore.getState();
    store.setIsRemovingBg(true);

    try {
        // Get the image element from fabric object
        const imgElement = activeObject.getElement();

        // Create a temporary canvas to get the image data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgElement.naturalWidth || imgElement.width;
        tempCanvas.height = imgElement.naturalHeight || imgElement.height;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0);

        // Get blob from canvas
        const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/png'));

        // Remove background using imgly
        const resultBlob = await imglyRemoveBackground(blob, {
            progress: (key, current, total) => {
                console.log(`Background removal: ${key} - ${Math.round((current / total) * 100)}%`);
            }
        });

        // Convert blob to data URL
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(resultBlob);
        });

        // Store original image data for potential revert
        if (!activeObject._originalSrc) {
            activeObject._originalSrc = activeObject.getSrc();
        }

        // Create new image with removed background
        const newImg = await fabric.FabricImage.fromURL(dataUrl, {
            crossOrigin: 'anonymous'
        });

        // Copy properties from original image
        newImg.set({
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            angle: activeObject.angle,
            flipX: activeObject.flipX,
            flipY: activeObject.flipY,
            opacity: activeObject.opacity,
            id: activeObject.id,
            name: activeObject.name || 'Image (BG Removed)',
            _originalSrc: activeObject._originalSrc,
            _hasBgRemoved: true,
        });

        // Replace the old image with new one
        canvas.remove(activeObject);
        canvas.add(newImg);
        canvas.setActiveObject(newImg);
        canvas.requestRenderAll();

        store.saveToHistory();
        store.updateLayers();
        store.setSelectedObject(newImg);

        console.log('Background removed successfully!');

    } catch (error) {
        console.error('Error removing background:', error);
        alert('Failed to remove background. Please try again.');
    } finally {
        store.setIsRemovingBg(false);
    }
};

/**
 * Revert background removal - restore original image
 */
export const revertBackgroundRemoval = async (canvas) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image' || !activeObject._originalSrc) {
        console.warn('No original image to revert to');
        return;
    }

    const store = useStore.getState();
    store.setIsRemovingBg(true);

    try {
        // Load original image
        const originalImg = await fabric.FabricImage.fromURL(activeObject._originalSrc, {
            crossOrigin: 'anonymous'
        });

        // Copy properties
        originalImg.set({
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            angle: activeObject.angle,
            flipX: activeObject.flipX,
            flipY: activeObject.flipY,
            opacity: activeObject.opacity,
            id: activeObject.id,
            name: 'Image',
            _originalSrc: activeObject._originalSrc,
            _hasBgRemoved: false,
        });

        // Replace
        canvas.remove(activeObject);
        canvas.add(originalImg);
        canvas.setActiveObject(originalImg);
        canvas.requestRenderAll();

        store.saveToHistory();
        store.updateLayers();
        store.setSelectedObject(originalImg);

        console.log('Background restored successfully!');

    } catch (error) {
        console.error('Error reverting background:', error);
    } finally {
        store.setIsRemovingBg(false);
    }
};
