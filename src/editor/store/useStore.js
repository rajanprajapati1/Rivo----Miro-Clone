import { create } from 'zustand';

const MAX_HISTORY = 50;

const useStore = create((set, get) => ({
  // Canvas Reference
  canvas: null,

  // Active Tool State
  activeTool: 'select', // select, brush, eraser, text, shape, pan, crop

  // Selected Object
  selectedObject: null,

  // Brush/Eraser Settings
  brushSize: 5,
  brushColor: '#000000',
  brushOpacity: 1,
  eraserSize: 20,

  // Shape Settings
  shapeType: 'rect', // rect, circle, line, triangle
  shapeFill: '#ff0000',
  shapeStroke: '#000000',
  shapeStrokeWidth: 2,

  // Text Settings
  fontSize: 30,
  fontFamily: 'Arial',
  fontColor: '#000000',

  // Canvas Settings
  canvasWidth: 800,
  canvasHeight: 600,
  backgroundColor: '#ffffff',

  // Zoom & Pan
  zoomLevel: 1,
  isPanning: false,

  // History for Undo/Redo
  history: [],
  historyIndex: -1,
  isHistoryAction: false, // Flag to prevent saving during undo/redo

  // Layers
  layers: [],

  // Export Quality
  exportQuality: 0.9,

  // Background Removal
  isRemovingBg: false,
  setIsRemovingBg: (value) => set({ isRemovingBg: value }),

  // Asset Panel
  isAssetPanelOpen: false,
  setAssetPanelOpen: (value) => set({ isAssetPanelOpen: value }),

  // Crop State
  cropState: null,
  setCropState: (state) => set({ cropState: state }),

  // Actions
  setCanvas: (canvas) => set({ canvas }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),

  // Brush Settings
  setBrushSize: (size) => set({ brushSize: size }),
  setBrushColor: (color) => set({ brushColor: color }),
  setBrushOpacity: (opacity) => set({ brushOpacity: opacity }),
  setEraserSize: (size) => set({ eraserSize: size }),

  // Shape Settings
  setShapeType: (type) => set({ shapeType: type }),
  setShapeFill: (fill) => set({ shapeFill: fill }),
  setShapeStroke: (stroke) => set({ shapeStroke: stroke }),
  setShapeStrokeWidth: (width) => set({ shapeStrokeWidth: width }),

  // Text Settings
  setFontSize: (size) => set({ fontSize: size }),
  setFontFamily: (family) => set({ fontFamily: family }),
  setFontColor: (color) => set({ fontColor: color }),

  // Canvas Settings
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setZoomLevel: (level) => set({ zoomLevel: level }),

  // Export
  setExportQuality: (quality) => set({ exportQuality: quality }),

  // History Management
  saveToHistory: () => {
    const { canvas, history, historyIndex, isHistoryAction } = get();
    if (!canvas || isHistoryAction) return;

    const json = canvas.toJSON(['id', 'selectable', 'evented', '_originalSrc', '_hasBgRemoved', '_hasCrop', '_originalClipPath']);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(json));

    // Limit history size
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    set({ isHistoryAction: true, historyIndex: newIndex });

    canvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
      canvas.requestRenderAll();
      set({ isHistoryAction: false });
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    set({ isHistoryAction: true, historyIndex: newIndex });

    canvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
      canvas.requestRenderAll();
      set({ isHistoryAction: false });
    });
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  clearHistory: () => set({ history: [], historyIndex: -1 }),

  // Layer Management
  updateLayers: () => {
    const { canvas } = get();
    if (!canvas) return;

    const objects = canvas.getObjects().filter(obj => !obj._isCropOverlay && !obj._isCropDarkOverlay);
    const layers = objects.map((obj, index) => ({
      id: obj.id || `layer-${index}`,
      name: obj.name || `Layer ${index + 1}`,
      type: obj.type,
      visible: obj.visible !== false,
      locked: !obj.selectable,
      object: obj
    }));

    set({ layers: layers.reverse() }); // Top layers first
  },
}));

export default useStore;