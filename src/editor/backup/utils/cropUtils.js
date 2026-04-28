import * as fabric from 'fabric';
import useStore from '../store/useStore';

/**
 * Crop Tool - Non-destructive cropping using clipPath (masking)
 */

// Aspect ratio presets
export const ASPECT_RATIOS = {
    free: { label: 'Free', value: null },
    square: { label: '1:1', value: 1 },
    landscape_16_9: { label: '16:9', value: 16 / 9 },
    landscape_4_3: { label: '4:3', value: 4 / 3 },
    portrait_9_16: { label: '9:16', value: 9 / 16 },
    portrait_3_4: { label: '3:4', value: 3 / 4 },
};

/**
 * Start crop mode - creates a crop overlay on the selected image
 */
export const startCropMode = (canvas) => {
    if (!canvas) return null;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') {
        console.warn('Please select an image to crop');
        return null;
    }

    const store = useStore.getState();

    // Store original image source for revert
    if (!activeObject._originalSrc) {
        activeObject._originalSrc = activeObject.getSrc();
    }

    // Store original state
    const originalState = {
        left: activeObject.left,
        top: activeObject.top,
        scaleX: activeObject.scaleX,
        scaleY: activeObject.scaleY,
        angle: activeObject.angle,
    };

    // Get image position (handle different origins)
    const imgWidth = activeObject.getScaledWidth();
    const imgHeight = activeObject.getScaledHeight();

    // Calculate top-left corner based on origin
    let imgLeft = activeObject.left;
    let imgTop = activeObject.top;

    if (activeObject.originX === 'center') imgLeft -= imgWidth / 2;
    if (activeObject.originY === 'center') imgTop -= imgHeight / 2;

    // Create crop rectangle (start at 80% of image size, centered)
    const padding = 0.1;
    const cropRect = new fabric.Rect({
        left: imgLeft + imgWidth * padding,
        top: imgTop + imgHeight * padding,
        width: imgWidth * (1 - padding * 2),
        height: imgHeight * (1 - padding * 2),
        fill: 'rgba(255,255,255,0.2)',
        stroke: '#6366f1',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        cornerColor: '#6366f1',
        cornerStyle: 'circle',
        cornerSize: 10,
        transparentCorners: false,
        hasRotatingPoint: false,
        lockRotation: true,
        originX: 'left',
        originY: 'top',
        id: 'crop-overlay',
        _isCropOverlay: true,
    });

    canvas.add(cropRect);
    canvas.setActiveObject(cropRect);
    canvas.requestRenderAll();

    // Make image non-selectable during crop
    activeObject.selectable = false;
    activeObject.evented = false;

    store.setCropState({
        isActive: true,
        targetImage: activeObject,
        cropRect: cropRect,
        originalState: originalState,
        aspectRatio: null,
    });

    return cropRect;
};

/**
 * Set aspect ratio for crop
 */
export const setCropAspectRatio = (canvas, ratio) => {
    const store = useStore.getState();
    const { cropRect, targetImage } = store.cropState || {};

    if (!cropRect || !targetImage) return;

    store.setCropState({ ...store.cropState, aspectRatio: ratio });

    if (ratio === null) {
        cropRect.setControlsVisibility({
            mt: true, mb: true, ml: true, mr: true,
            tl: true, tr: true, bl: true, br: true,
        });
        cropRect.lockUniScaling = false;
        canvas.requestRenderAll();
        return;
    }

    const imgWidth = targetImage.getScaledWidth();
    const imgHeight = targetImage.getScaledHeight();

    let imgLeft = targetImage.left;
    let imgTop = targetImage.top;
    if (targetImage.originX === 'center') imgLeft -= imgWidth / 2;
    if (targetImage.originY === 'center') imgTop -= imgHeight / 2;

    let newWidth, newHeight;

    if (ratio >= 1) {
        newWidth = Math.min(imgWidth * 0.8, imgHeight * 0.8 * ratio);
        newHeight = newWidth / ratio;
    } else {
        newHeight = Math.min(imgHeight * 0.8, imgWidth * 0.8 / ratio);
        newWidth = newHeight * ratio;
    }

    cropRect.set({
        scaleX: 1,
        scaleY: 1,
        width: newWidth,
        height: newHeight,
        left: imgLeft + (imgWidth - newWidth) / 2,
        top: imgTop + (imgHeight - newHeight) / 2,
    });

    cropRect.setControlsVisibility({
        mt: false, mb: false, ml: false, mr: false,
        tl: true, tr: true, bl: true, br: true,
    });
    cropRect.lockUniScaling = true;
    cropRect.setCoords();
    canvas.requestRenderAll();
};

/**
 * Rotate image inside crop
 */
export const rotateCropImage = (canvas, degrees = 90) => {
    const store = useStore.getState();
    const { targetImage } = store.cropState || {};

    if (!targetImage) return;

    const currentAngle = targetImage.angle || 0;
    targetImage.rotate(currentAngle + degrees);
    canvas.requestRenderAll();
};

/**
 * Apply crop - uses clipPath for non-destructive cropping
 */
export const applyCrop = (canvas) => {
    const store = useStore.getState();
    const { targetImage, cropRect } = store.cropState || {};

    if (!targetImage || !cropRect) return;

    // Get the crop rectangle position
    const cropLeft = cropRect.left;
    const cropTop = cropRect.top;
    const cropWidth = cropRect.getScaledWidth();
    const cropHeight = cropRect.getScaledHeight();

    // Get image position
    let imgLeft = targetImage.left;
    let imgTop = targetImage.top;
    const imgWidth = targetImage.getScaledWidth();
    const imgHeight = targetImage.getScaledHeight();

    if (targetImage.originX === 'center') imgLeft -= imgWidth / 2;
    if (targetImage.originY === 'center') imgTop -= imgHeight / 2;

    // Calculate clip path relative to image's own coordinate system
    // The clipPath is positioned relative to the object's center
    const clipX = (cropLeft - imgLeft) / targetImage.scaleX - targetImage.width / 2;
    const clipY = (cropTop - imgTop) / targetImage.scaleY - targetImage.height / 2;
    const clipW = cropWidth / targetImage.scaleX;
    const clipH = cropHeight / targetImage.scaleY;

    // Create clip path
    const clipPath = new fabric.Rect({
        left: clipX,
        top: clipY,
        width: clipW,
        height: clipH,
        absolutePositioned: false,
    });

    // Apply clip path to image
    targetImage.set({
        clipPath: clipPath,
        _hasCrop: true,
    });

    // Clean up
    canvas.remove(cropRect);

    // Restore image interactivity
    targetImage.selectable = true;
    targetImage.evented = true;
    canvas.setActiveObject(targetImage);
    canvas.requestRenderAll();

    // Save to history
    store.saveToHistory();
    store.updateLayers();

    // Reset crop state
    store.setCropState(null);
    store.setSelectedObject(targetImage);

    console.log('Crop applied (non-destructive)');
};

/**
 * Cancel crop
 */
export const cancelCrop = (canvas) => {
    const store = useStore.getState();
    const { targetImage, cropRect, originalState } = store.cropState || {};

    if (!canvas) return;

    if (targetImage && originalState) {
        targetImage.set(originalState);
        targetImage.selectable = true;
        targetImage.evented = true;
        canvas.setActiveObject(targetImage);
    }

    if (cropRect) canvas.remove(cropRect);

    canvas.requestRenderAll();
    store.setCropState(null);
};

/**
 * Remove crop from image
 */
export const removeCrop = (canvas) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') return;

    if (activeObject._hasCrop) {
        activeObject.set({
            clipPath: null,
            _hasCrop: false,
        });
        canvas.requestRenderAll();
        useStore.getState().saveToHistory();
        console.log('Crop removed');
    }
};
