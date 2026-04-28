import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Slider,
  Divider,
  Typography,
  CircularProgress,
  Fade,
  ClickAwayListener,
  Button
} from '@mui/material';
import {
  Brush,
  NearMe,
  Title,
  CropSquare,
  CircleOutlined,
  ChangeHistory,
  Image as ImageIcon,
  AutoFixHigh,
  PanTool,
  AutoAwesome,
  Replay,
  Crop,
  RotateRight,
  Check,
  Close
} from '@mui/icons-material';
import useStore from './store/useStore';
import { handleImageUpload, addShape, addText } from './utils/canvasUtils';
import { removeImageBackground, revertBackgroundRemoval } from './utils/bgRemoval';
import {
  startCropMode,
  applyCrop,
  cancelCrop,
  setCropAspectRatio,
  rotateCropImage,
  ASPECT_RATIOS
} from './utils/cropUtils';

const ToolsPanel = () => {
  const {
    activeTool,
    setActiveTool,
    canvas,
    brushSize,
    setBrushSize,
    brushColor,
    setBrushColor,
    eraserSize,
    setEraserSize,
    shapeFill,
    setShapeFill,
    selectedObject,
    isRemovingBg,
    cropState
  } = useStore();

  const [showSizePanel, setShowSizePanel] = useState(false);
  const [currentSizeTool, setCurrentSizeTool] = useState(null);
  const [selectedRatio, setSelectedRatio] = useState('free');

  const handleAddShape = (type) => addShape(canvas, type);
  const handleAddText = () => addText(canvas);

  const isImageSelected = selectedObject?.type === 'image';
  const hasBgRemoved = selectedObject?._hasBgRemoved;
  const isCropMode = cropState?.isActive;

  const btnSize = 32;
  const iconSize = 18;

  const handleToolClick = (tool) => {
    setActiveTool(tool);
    if (tool === 'brush' || tool === 'eraser') {
      setCurrentSizeTool(tool);
      setShowSizePanel(true);
    } else {
      setShowSizePanel(false);
      setCurrentSizeTool(null);
    }
  };

  const handleClickAway = () => {
    setShowSizePanel(false);
  };

  const handleStartCrop = () => {
    startCropMode(canvas);
    setSelectedRatio('free');
  };

  const handleApplyCrop = () => {
    applyCrop(canvas);
  };

  const handleCancelCrop = () => {
    cancelCrop(canvas);
  };

  const handleAspectRatioChange = (ratioKey) => {
    setSelectedRatio(ratioKey);
    setCropAspectRatio(canvas, ASPECT_RATIOS[ratioKey].value);
  };

  const ToolBtn = ({ tool, icon, label }) => (
    <Tooltip title={label} arrow placement="right">
      <IconButton
        onClick={() => handleToolClick(tool)}
        sx={{
          width: btnSize,
          height: btnSize,
          borderRadius: '8px',
          color: activeTool === tool ? '#fff' : '#71717a',
          bgcolor: activeTool === tool ? '#18181b' : 'transparent',
          transition: 'all 0.15s ease',
          '&:hover': {
            bgcolor: activeTool === tool ? '#18181b' : '#f4f4f5',
            color: activeTool === tool ? '#fff' : '#18181b',
            transform: 'scale(1.05)'
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  const ActionBtn = ({ onClick, icon, label, component, children, disabled, loading, highlight }) => (
    <Tooltip title={label} arrow placement="right">
      <span>
        <IconButton
          onClick={onClick}
          component={component}
          disabled={disabled || loading}
          sx={{
            width: btnSize,
            height: btnSize,
            borderRadius: '8px',
            color: highlight ? '#fff' : '#71717a',
            bgcolor: highlight ? '#7c3aed' : 'transparent',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: highlight ? '#6d28d9' : '#f4f4f5',
              color: highlight ? '#fff' : '#18181b',
              transform: 'scale(1.05)'
            },
            '&.Mui-disabled': {
              color: '#d4d4d8',
              bgcolor: 'transparent',
            },
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: '#71717a' }} /> : icon}
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <>
      {/* Main Toolbar */}
      <Box
        sx={{
          position: 'fixed',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.25,
          background: '#ffffff',
          borderRadius: '12px',
          padding: '8px 6px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          zIndex: 1000,
        }}
      >
        <ToolBtn tool="select" icon={<NearMe sx={{ fontSize: iconSize }} />} label="Select (V)" />
        <ToolBtn tool="pan" icon={<PanTool sx={{ fontSize: iconSize }} />} label="Pan" />

        <Divider sx={{ width: 18, my: 0.5, borderColor: '#e4e4e7' }} />

        <ToolBtn tool="brush" icon={<Brush sx={{ fontSize: iconSize }} />} label="Brush (B)" />
        <ToolBtn tool="eraser" icon={<AutoFixHigh sx={{ fontSize: iconSize }} />} label="Eraser (E)" />

        <Divider sx={{ width: 18, my: 0.5, borderColor: '#e4e4e7' }} />

        <ActionBtn onClick={() => handleAddShape('rect')} icon={<CropSquare sx={{ fontSize: iconSize }} />} label="Rectangle" />
        <ActionBtn onClick={() => handleAddShape('circle')} icon={<CircleOutlined sx={{ fontSize: iconSize }} />} label="Circle" />
        <ActionBtn onClick={() => handleAddShape('triangle')} icon={<ChangeHistory sx={{ fontSize: iconSize }} />} label="Triangle" />

        <Divider sx={{ width: 18, my: 0.5, borderColor: '#e4e4e7' }} />

        <ActionBtn onClick={handleAddText} icon={<Title sx={{ fontSize: iconSize }} />} label="Text (T)" />
        <ActionBtn component="label" icon={<ImageIcon sx={{ fontSize: iconSize }} />} label="Image">
          <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, canvas)} />
        </ActionBtn>

        <Divider sx={{ width: 18, my: 0.5, borderColor: '#e4e4e7' }} />

        {/* Crop Tool - Only show when image is selected */}
        {isImageSelected && !isCropMode && (
          <ActionBtn
            onClick={handleStartCrop}
            icon={<Crop sx={{ fontSize: iconSize }} />}
            label="Crop Image"
          />
        )}

        {/* Background Removal */}
        {isImageSelected && !isCropMode && (
          <>
            {hasBgRemoved ? (
              <ActionBtn
                onClick={() => revertBackgroundRemoval(canvas)}
                icon={<Replay sx={{ fontSize: iconSize }} />}
                label="Restore Background"
                loading={isRemovingBg}
              />
            ) : (
              <ActionBtn
                onClick={() => removeImageBackground(canvas)}
                icon={<AutoAwesome sx={{ fontSize: iconSize }} />}
                label="Remove Background (AI)"
                loading={isRemovingBg}
                highlight={true}
              />
            )}
          </>
        )}

        {(isImageSelected || isCropMode) && <Divider sx={{ width: 18, my: 0.5, borderColor: '#e4e4e7' }} />}

        <Tooltip title="Fill Color" arrow placement="right">
          <Box sx={{
            width: 22, height: 22, borderRadius: 25,
            border: '1px solid #e4e4e7', overflow: 'hidden', cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: '#a1a1aa', transform: 'scale(1.05)' }
          }}>
            <input type="color" value={shapeFill} onChange={(e) => setShapeFill(e.target.value)}
              style={{ width: '150%', height: '150%', marginTop: '-25%', marginLeft: '-25%', cursor: 'pointer', border: 'none' }} />
          </Box>
        </Tooltip>
      </Box>

      {/* Floating Size Panel */}
      {showSizePanel && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Fade in={showSizePanel} timeout={200}>
            <Box
              sx={{
                position: 'fixed',
                left: 64,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                background: '#ffffff',
                borderRadius: '10px',
                padding: '10px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                zIndex: 1001,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ color: '#71717a', fontSize: 11, fontWeight: 600 }}>Size</Typography>
                <Slider
                  size="small"
                  value={currentSizeTool === 'brush' ? brushSize : eraserSize}
                  onChange={(e, val) => currentSizeTool === 'brush' ? setBrushSize(val) : setEraserSize(val)}
                  min={1}
                  max={80}
                  sx={{ width: 100, color: '#18181b', '& .MuiSlider-thumb': { width: 14, height: 14 } }}
                />
                <Typography sx={{ color: '#18181b', fontSize: 12, fontWeight: 600, minWidth: 28, textAlign: 'center', bgcolor: '#f4f4f5', borderRadius: '6px', px: 1, py: 0.5 }}>
                  {currentSizeTool === 'brush' ? brushSize : eraserSize}
                </Typography>
              </Box>
              {currentSizeTool === 'brush' && (
                <>
                  <Box sx={{ width: 1, height: 24, bgcolor: '#e4e4e7' }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#71717a', fontSize: 11, fontWeight: 600 }}>Color</Typography>
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', border: '2px solid #e4e4e7', overflow: 'hidden', cursor: 'pointer' }}>
                      <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)}
                        style={{ width: '150%', height: '150%', marginTop: '-25%', marginLeft: '-25%', cursor: 'pointer', border: 'none' }} />
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Fade>
        </ClickAwayListener>
      )}

      {/* Crop Panel - Appears when crop mode is active */}
      {isCropMode && (
        <Fade in={true} timeout={200}>
          <Box
            sx={{
              position: 'fixed',
              left: 64,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              background: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              zIndex: 1001,
              minWidth: 180,
            }}
          >
            {/* Title */}
            <Typography sx={{ color: '#18181b', fontSize: 13, fontWeight: 700 }}>
              Crop Image
            </Typography>

            {/* Aspect Ratios */}
            <Box>
              <Typography sx={{ color: '#71717a', fontSize: 10, fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                Aspect Ratio
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {Object.entries(ASPECT_RATIOS).map(([key, { label }]) => (
                  <Box
                    key={key}
                    onClick={() => handleAspectRatioChange(key)}
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: '6px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      bgcolor: selectedRatio === key ? '#18181b' : '#f4f4f5',
                      color: selectedRatio === key ? '#fff' : '#52525b',
                      transition: 'all 0.15s ease',
                      '&:hover': {
                        bgcolor: selectedRatio === key ? '#18181b' : '#e4e4e7',
                      }
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Rotate */}
            <Box>
              <Typography sx={{ color: '#71717a', fontSize: 10, fontWeight: 600, mb: 1, textTransform: 'uppercase' }}>
                Rotate
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Rotate Left" arrow>
                  <IconButton
                    onClick={() => rotateCropImage(canvas, -90)}
                    size="small"
                    sx={{ bgcolor: '#f4f4f5', '&:hover': { bgcolor: '#e4e4e7' } }}
                  >
                    <RotateRight sx={{ fontSize: 18, transform: 'scaleX(-1)' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Rotate Right" arrow>
                  <IconButton
                    onClick={() => rotateCropImage(canvas, 90)}
                    size="small"
                    sx={{ bgcolor: '#f4f4f5', '&:hover': { bgcolor: '#e4e4e7' } }}
                  >
                    <RotateRight sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#f4f4f5' }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={handleCancelCrop}
                startIcon={<Close sx={{ fontSize: 16 }} />}
                size="small"
                sx={{
                  flex: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#52525b',
                  bgcolor: '#f4f4f5',
                  '&:hover': { bgcolor: '#e4e4e7' }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyCrop}
                startIcon={<Check sx={{ fontSize: 16 }} />}
                size="small"
                variant="contained"
                sx={{
                  flex: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 12,
                  bgcolor: '#18181b',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#27272a', boxShadow: 'none' }
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </>
  );
};

export default ToolsPanel;