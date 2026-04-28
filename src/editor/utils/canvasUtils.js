import * as fabric from 'fabric';
import useStore from '../store/useStore';

/**
 * Handle Image Upload from file input
 */
export const handleImageUpload = async (e, canvas) => {
  const file = e.target.files?.[0];
  if (!file || !canvas) return;

  try {
    const dataUrl = await readFileAsDataURL(file);
    await addImageToCanvas(canvas, dataUrl);
    useStore.getState().saveToHistory();
    useStore.getState().updateLayers();
  } catch (error) {
    console.error('Error uploading image:', error);
  }

  // Reset input so same file can be uploaded again
  e.target.value = '';
};

/**
 * Read file as Data URL
 */
const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Add image to canvas from URL/DataURL
 */
export const addImageToCanvas = async (canvas, imageUrl) => {
  if (!canvas) return;

  try {
    // Fabric.js 6.x uses async/await pattern
    const img = await fabric.FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    });

    // Scale image to fit canvas while maintaining aspect ratio
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const maxWidth = canvasWidth * 0.8;
    const maxHeight = canvasHeight * 0.8;

    const scaleX = maxWidth / img.width;
    const scaleY = maxHeight / img.height;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

    img.scale(scale);
    img.set({
      id: `image-${Date.now()}`,
      name: 'Image',
      left: (canvasWidth - img.getScaledWidth()) / 2,
      top: (canvasHeight - img.getScaledHeight()) / 2,
    });

    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();

    return img;
  } catch (error) {
    console.error('Error adding image to canvas:', error);
    throw error;
  }
};

/**
 * Handle paste from clipboard
 */
export const handlePaste = async (e, canvas) => {
  if (!canvas) return;

  const items = e.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault();
      const file = item.getAsFile();
      if (file) {
        const dataUrl = await readFileAsDataURL(file);
        await addImageToCanvas(canvas, dataUrl);
        useStore.getState().saveToHistory();
        useStore.getState().updateLayers();
      }
      break;
    }
  }
};

/**
 * Handle drag and drop
 */
export const handleDrop = async (e, canvas) => {
  e.preventDefault();
  if (!canvas) return;

  const files = e.dataTransfer?.files;
  if (!files?.length) return;

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      const dataUrl = await readFileAsDataURL(file);
      await addImageToCanvas(canvas, dataUrl);
    }
  }

  useStore.getState().saveToHistory();
  useStore.getState().updateLayers();
};

/**
 * STRICT WebP Export - Only WebP format allowed
 */
export const exportToWebP = (canvas, options = {}) => {
  if (!canvas) {
    console.warn('No canvas to export');
    return;
  }

  const {
    quality = useStore.getState().exportQuality,
    filename = `design-${Date.now()}`,
    transparentBackground = false,
    trimWhitespace = false
  } = options;

  // Deselect everything to avoid saving selection handles
  canvas.discardActiveObject();
  canvas.requestRenderAll();

  // Store original background
  const originalBg = canvas.backgroundColor;

  if (transparentBackground) {
    canvas.backgroundColor = 'transparent';
    canvas.requestRenderAll();
  }

  // Calculate export bounds if trimming
  let exportOptions = {
    format: 'webp',
    quality: quality,
    multiplier: 1,
  };

  if (trimWhitespace) {
    const objects = canvas.getObjects();
    if (objects.length > 0) {
      // Get bounding box of all objects
      const group = new fabric.Group(objects);
      const bounds = group.getBoundingRect();
      group.destroy();

      exportOptions = {
        ...exportOptions,
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height
      };
    }
  }

  // Export as WebP
  const dataURL = canvas.toDataURL(exportOptions);

  // Restore original background
  if (transparentBackground) {
    canvas.backgroundColor = originalBg;
    canvas.requestRenderAll();
  }

  // Download
  const link = document.createElement('a');
  link.download = `${filename}.webp`;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Clear canvas
 */
export const clearCanvas = (canvas) => {
  if (!canvas) return;

  canvas.clear();
  canvas.backgroundColor = useStore.getState().backgroundColor;
  canvas.requestRenderAll();
  useStore.getState().saveToHistory();
  useStore.getState().updateLayers();
};

/**
 * Add shape to canvas
 */
export const addShape = (canvas, type = 'rect') => {
  if (!canvas) return;

  const store = useStore.getState();
  const centerX = canvas.getWidth() / 2;
  const centerY = canvas.getHeight() / 2;

  const commonProps = {
    id: `${type}-${Date.now()}`,
    name: type.charAt(0).toUpperCase() + type.slice(1),
    fill: store.shapeFill,
    stroke: store.shapeStroke,
    strokeWidth: store.shapeStrokeWidth,
    left: centerX - 50,
    top: centerY - 50,
  };

  let shape;

  switch (type) {
    case 'rect':
      shape = new fabric.Rect({
        ...commonProps,
        width: 100,
        height: 100,
        rx: 0,
        ry: 0,
      });
      break;

    case 'circle':
      shape = new fabric.Circle({
        ...commonProps,
        radius: 50,
      });
      break;

    case 'triangle':
      shape = new fabric.Triangle({
        ...commonProps,
        width: 100,
        height: 100,
      });
      break;

    case 'line':
      shape = new fabric.Line([centerX - 50, centerY, centerX + 50, centerY], {
        ...commonProps,
        fill: null,
        stroke: store.shapeStroke,
        strokeWidth: store.shapeStrokeWidth,
      });
      break;

    default:
      return;
  }

  canvas.add(shape);
  canvas.setActiveObject(shape);
  canvas.requestRenderAll();

  store.saveToHistory();
  store.updateLayers();
  store.setActiveTool('select');

  return shape;
};

/**
 * Add text to canvas (center)
 */
export const addText = (canvas, text = 'Edit this text') => {
  if (!canvas) return;

  const store = useStore.getState();

  const textObj = new fabric.IText(text, {
    id: `text-${Date.now()}`,
    name: 'Text',
    left: canvas.getWidth() / 2 - 50,
    top: canvas.getHeight() / 2 - 20,
    fontSize: store.fontSize,
    fontFamily: store.fontFamily,
    fill: store.fontColor,
  });

  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  textObj.enterEditing();
  canvas.requestRenderAll();

  store.saveToHistory();
  store.updateLayers();

  return textObj;
};

/**
 * Add text at specific position (for double-click feature like Canva)
 */
export const addTextAtPosition = (canvas, x, y) => {
  if (!canvas) return;

  const store = useStore.getState();

  const textObj = new fabric.IText('Click to edit', {
    id: `text-${Date.now()}`,
    name: 'Text',
    left: x,
    top: y,
    fontSize: store.fontSize || 24,
    fontFamily: store.fontFamily || 'Arial',
    fill: store.fontColor || '#333333',
    originX: 'left',
    originY: 'top',
  });

  canvas.add(textObj);
  canvas.setActiveObject(textObj);

  // Enter editing mode and select all text
  textObj.enterEditing();
  textObj.selectAll();

  canvas.requestRenderAll();

  store.saveToHistory();
  store.updateLayers();

  return textObj;
};

/**
 * Delete selected objects
 */
export const deleteSelected = (canvas) => {
  if (!canvas) return;

  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length === 0) return;

  activeObjects.forEach(obj => canvas.remove(obj));
  canvas.discardActiveObject();
  canvas.requestRenderAll();

  useStore.getState().saveToHistory();
  useStore.getState().updateLayers();
};

/**
 * Duplicate selected objects
 */
export const duplicateSelected = async (canvas) => {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  const cloned = await activeObject.clone();
  cloned.set({
    left: activeObject.left + 20,
    top: activeObject.top + 20,
    id: `${activeObject.type}-${Date.now()}`,
  });

  canvas.add(cloned);
  canvas.setActiveObject(cloned);
  canvas.requestRenderAll();

  useStore.getState().saveToHistory();
  useStore.getState().updateLayers();
};

/**
 * Flip object
 */
export const flipObject = (canvas, direction = 'horizontal') => {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  if (direction === 'horizontal') {
    activeObject.set('flipX', !activeObject.flipX);
  } else {
    activeObject.set('flipY', !activeObject.flipY);
  }

  canvas.requestRenderAll();
  useStore.getState().saveToHistory();
};

/**
 * Move layer
 */
export const moveLayer = (canvas, direction) => {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject) return;

  switch (direction) {
    case 'up':
      canvas.bringObjectForward(activeObject);
      break;
    case 'down':
      canvas.sendObjectBackwards(activeObject);
      break;
    case 'front':
      canvas.bringObjectToFront(activeObject);
      break;
    case 'back':
      canvas.sendObjectToBack(activeObject);
      break;
  }

  canvas.requestRenderAll();
  useStore.getState().saveToHistory();
  useStore.getState().updateLayers();
};

/**
 * Apply filter to image
 */
export const applyFilter = async (canvas, filterType, value) => {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject || activeObject.type !== 'image') return;

  // Clear existing filters first
  activeObject.filters = activeObject.filters || [];

  let filter;

  switch (filterType) {
    case 'brightness':
      filter = new fabric.filters.Brightness({ brightness: value });
      break;
    case 'contrast':
      filter = new fabric.filters.Contrast({ contrast: value });
      break;
    case 'saturation':
      filter = new fabric.filters.Saturation({ saturation: value });
      break;
    case 'blur':
      filter = new fabric.filters.Blur({ blur: value });
      break;
    case 'grayscale':
      filter = new fabric.filters.Grayscale();
      break;
    case 'sepia':
      filter = new fabric.filters.Sepia();
      break;
    case 'invert':
      filter = new fabric.filters.Invert();
      break;
    case 'pixelate':
      filter = new fabric.filters.Pixelate({ blocksize: value });
      break;
    default:
      return;
  }

  // Remove existing filter of same type
  activeObject.filters = activeObject.filters.filter(f => f.type !== filter.type);

  // Add new filter
  activeObject.filters.push(filter);
  activeObject.applyFilters();
  canvas.requestRenderAll();

  useStore.getState().saveToHistory();
};

/**
 * Reset all filters on selected image
 */
export const resetFilters = (canvas) => {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject || activeObject.type !== 'image') return;

  activeObject.filters = [];
  activeObject.applyFilters();
  canvas.requestRenderAll();

  useStore.getState().saveToHistory();
};

/**
 * Set up keyboard shortcuts
 */
export const setupKeyboardShortcuts = (canvas) => {
  const handleKeyDown = (e) => {
    // Ignore if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const store = useStore.getState();

    // Check for active text editing
    const activeObject = canvas?.getActiveObject();
    if (activeObject?.isEditing) return;

    // Ctrl/Cmd combinations
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            store.redo();
          } else {
            store.undo();
          }
          break;
        case 'y':
          e.preventDefault();
          store.redo();
          break;
        case 'c':
          // Copy - handled by browser
          break;
        case 'v':
          // Paste - handled by paste event
          break;
        case 'd':
          e.preventDefault();
          duplicateSelected(canvas);
          break;
        case 'a':
          e.preventDefault();
          canvas?.selectAll();
          canvas?.requestRenderAll();
          break;
        case 's':
          e.preventDefault();
          exportToWebP(canvas);
          break;
      }
    } else {
      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          if (!activeObject?.isEditing) {
            e.preventDefault();
            deleteSelected(canvas);
          }
          break;
        case 'Escape':
          canvas?.discardActiveObject();
          canvas?.requestRenderAll();
          store.setActiveTool('select');
          break;
        case 'v':
        case 'V':
          store.setActiveTool('select');
          break;
        case 'b':
        case 'B':
          store.setActiveTool('brush');
          break;
        case 'e':
        case 'E':
          store.setActiveTool('eraser');
          break;
        case 't':
        case 'T':
          store.setActiveTool('text');
          break;
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
};

/**
 * Add Asset from Registry to Canvas
 */
export const addAsset = (canvas, asset) => {
  if (!canvas || !asset) return;

  const store = useStore.getState();
  const centerX = canvas.getWidth() / 2;
  const centerY = canvas.getHeight() / 2;

  const commonProps = {
    id: `asset-${Date.now()}`,
    name: asset.name,
    left: centerX - 50,
    top: centerY - 50,
    fill: asset.data?.fill || '#18181b',
  };

  // Handle Emojis
  if (asset.type === 'emojis') {
    const text = new fabric.IText(asset.icon, {
      ...commonProps,
      fontSize: 80,
      fontFamily: 'Arial',
      text: asset.icon, // The emoji character
      left: centerX,
      top: centerY,
      originX: 'center',
      originY: 'center',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
    store.saveToHistory();
    store.updateLayers();
    return;
  }

  // Handle Shapes & Icons (if they have path data)
  if (asset.data) {
    let obj;

    if (asset.data.type === 'path') {
      obj = new fabric.Path(asset.data.path, {
        ...commonProps,
        scaleX: 1,
        scaleY: 1,
      });
      // Center the path
      const dims = obj.getBoundingRect();
      obj.set({
        left: centerX - dims.width / 2,
        top: centerY - dims.height / 2
      });
    } else if (asset.data.type === 'rect') {
      obj = new fabric.Rect({
        ...commonProps,
        width: asset.data.width || 100,
        height: asset.data.height || 100,
      });
    } else if (asset.data.type === 'circle') {
      obj = new fabric.Circle({
        ...commonProps,
        radius: asset.data.radius || 50,
      });
    } else if (asset.data.type === 'triangle') {
      obj = new fabric.Triangle({
        ...commonProps,
        width: asset.data.width || 100,
        height: asset.data.height || 100,
      });
    } else if (asset.data.type === 'polygon') {
      // Create regular polygon points
      const points = [];
      const sides = asset.data.sides || 5;
      const radius = asset.data.radius || 50;
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        points.push({
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)
        });
      }
      obj = new fabric.Polygon(points, {
        ...commonProps,
        objectCaching: false,
      });
    }

    if (obj) {
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
      store.saveToHistory();
      store.updateLayers();
    }
  }
};