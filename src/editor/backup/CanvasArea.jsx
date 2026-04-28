import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Add, Remove, CropFree } from '@mui/icons-material';
import useStore from './store/useStore';
import { handlePaste, handleDrop, setupKeyboardShortcuts, addTextAtPosition } from './utils/canvasUtils';

const CanvasArea = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  const {
    setCanvas, activeTool, setSelectedObject, saveToHistory, updateLayers,
    brushSize, brushColor, brushOpacity, eraserSize, backgroundColor, zoomLevel, setZoomLevel
  } = useStore();

  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    const container = containerRef.current;
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: container?.clientWidth || window.innerWidth,
      height: container?.clientHeight || window.innerHeight,
      backgroundColor: backgroundColor,
      isDrawingMode: false,
      preserveObjectStacking: true,
      selection: true,
    });

    fabricCanvasRef.current = initCanvas;
    setCanvas(initCanvas);

    const handleSelection = (e) => setSelectedObject(e.selected ? e.selected[0] : null);
    initCanvas.on('selection:created', handleSelection);
    initCanvas.on('selection:updated', handleSelection);
    initCanvas.on('selection:cleared', () => setSelectedObject(null));
    initCanvas.on('object:modified', () => { saveToHistory(); updateLayers(); });
    initCanvas.on('object:added', () => updateLayers());
    initCanvas.on('object:removed', () => updateLayers());
    initCanvas.on('path:created', () => { saveToHistory(); updateLayers(); });

    initCanvas.on('mouse:dblclick', (opt) => {
      if (opt.target || initCanvas.isDrawingMode) return;
      const pointer = initCanvas.getPointer(opt.e);
      addTextAtPosition(initCanvas, pointer.x, pointer.y);
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      initCanvas.setWidth(containerRef.current.clientWidth);
      initCanvas.setHeight(containerRef.current.clientHeight);
      initCanvas.requestRenderAll();
    };
    window.addEventListener('resize', handleResize);

    const onPaste = (e) => handlePaste(e, initCanvas);
    document.addEventListener('paste', onPaste);
    const onDrop = (e) => handleDrop(e, initCanvas);
    container?.addEventListener('drop', onDrop);
    container?.addEventListener('dragover', (e) => e.preventDefault());

    const cleanupKeyboard = setupKeyboardShortcuts(initCanvas);
    saveToHistory();

    return () => {
      initCanvas.dispose();
      fabricCanvasRef.current = null;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('paste', onPaste);
      cleanupKeyboard();
    };
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';

    switch (activeTool) {
      case 'brush':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = brushColor;
        canvas.defaultCursor = 'crosshair';
        break;
      case 'eraser':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = eraserSize;
        canvas.freeDrawingBrush.color = 'rgba(255,255,255,1)';
        canvas.freeDrawingBrush.onMouseUp = function () {
          const lastPath = canvas.getObjects().pop();
          if (lastPath?.type === 'path') {
            lastPath.set({ globalCompositeOperation: 'destination-out', selectable: false, evented: false });
            canvas.requestRenderAll();
          }
        };
        canvas.defaultCursor = 'crosshair';
        break;
      case 'pan':
        canvas.defaultCursor = 'grab';
        canvas.selection = false;
        break;
    }
    canvas.requestRenderAll();
  }, [activeTool, brushSize, brushColor, eraserSize]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.backgroundColor = backgroundColor;
    canvas.requestRenderAll();
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let isPanning = false, lastX = 0, lastY = 0;

    const onDown = (opt) => {
      if (activeTool === 'pan' || opt.e.altKey) {
        isPanning = true;
        canvas.defaultCursor = 'grabbing';
        lastX = opt.e.clientX;
        lastY = opt.e.clientY;
        canvas.selection = false;
      }
    };
    const onMove = (opt) => {
      if (isPanning) {
        canvas.relativePan(new fabric.Point(opt.e.clientX - lastX, opt.e.clientY - lastY));
        lastX = opt.e.clientX;
        lastY = opt.e.clientY;
      }
    };
    const onUp = () => {
      isPanning = false;
      canvas.defaultCursor = activeTool === 'pan' ? 'grab' : 'default';
      if (activeTool !== 'pan') canvas.selection = true;
    };

    canvas.on('mouse:down', onDown);
    canvas.on('mouse:move', onMove);
    canvas.on('mouse:up', onUp);

    return () => { canvas.off('mouse:down', onDown); canvas.off('mouse:move', onMove); canvas.off('mouse:up', onUp); };
  }, [activeTool]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const onWheel = (opt) => {
      let zoom = canvas.getZoom() * (0.999 ** opt.e.deltaY);
      zoom = Math.max(0.1, Math.min(20, zoom));
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      setZoomLevel(zoom);
      opt.e.preventDefault();
    };

    canvas.on('mouse:wheel', onWheel);
    return () => canvas.off('mouse:wheel', onWheel);
  }, []);

  const handleZoom = (dir) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    let z = canvas.getZoom();
    if (dir === 'in') z = Math.min(z * 1.2, 20);
    else if (dir === 'out') z = Math.max(z / 1.2, 0.1);
    else { z = 1; canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); }
    canvas.setZoom(z);
    canvas.requestRenderAll();
    setZoomLevel(z);
  };

  return (
    <Box ref={containerRef} sx={{ position: 'absolute', inset: 0, overflow: 'hidden', bgcolor: '#f4f4f5' }}>
      <canvas ref={canvasRef} />

      {/* Zoom */}
      <Box sx={{
        position: 'fixed', bottom: 16, right: 16, display: 'flex', alignItems: 'center', gap: 0.5,
        background: '#fff', borderRadius: '10px', padding: '4px 6px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)', zIndex: 1000,
      }}>
        <Tooltip title="Zoom Out" arrow>
          <IconButton onClick={() => handleZoom('out')} size="small" sx={{ color: '#71717a', '&:hover': { color: '#18181b' } }}>
            <Remove sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Typography onClick={() => handleZoom('reset')}
          sx={{ color: '#52525b', minWidth: 40, textAlign: 'center', cursor: 'pointer', fontSize: 11, fontWeight: 600, '&:hover': { color: '#18181b' } }}>
          {Math.round(zoomLevel * 100)}%
        </Typography>
        <Tooltip title="Zoom In" arrow>
          <IconButton onClick={() => handleZoom('in')} size="small" sx={{ color: '#71717a', '&:hover': { color: '#18181b' } }}>
            <Add sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset" arrow>
          <IconButton onClick={() => handleZoom('reset')} size="small" sx={{ color: '#71717a', '&:hover': { color: '#18181b' } }}>
            <CropFree sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default CanvasArea;