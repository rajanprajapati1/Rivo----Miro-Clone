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
  Close,
  Interests,
  Add,
  StickyNote2Outlined,
  GridViewOutlined,
  AspectRatioOutlined,
  Undo,
  Redo,
  ChatBubbleOutline,
  EmojiEmotionsOutlined,
  WidgetsOutlined,
  CreateOutlined
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
    cropState,
    isAssetPanelOpen,
    setAssetPanelOpen,
    undo,
    redo,
    canUndo,
    canRedo
  } = useStore();

  const [showSizePanel, setShowSizePanel] = useState(false);
  const [currentSizeTool, setCurrentSizeTool] = useState(null);
  const [selectedRatio, setSelectedRatio] = useState('free');

  const handleAddShape = (type) => addShape(canvas, type);
  const handleAddText = () => addText(canvas);

  const isImageSelected = selectedObject?.type === 'image';
  const hasBgRemoved = selectedObject?._hasBgRemoved;
  const isCropMode = cropState?.isActive;

  const btnSize = 36;
  const iconSize = 24;

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

  const handleApplyCrop = () => applyCrop(canvas);
  const handleCancelCrop = () => cancelCrop(canvas);

  const handleAspectRatioChange = (ratioKey) => {
    setSelectedRatio(ratioKey);
    setCropAspectRatio(canvas, ASPECT_RATIOS[ratioKey].value);
  };

  // Miro-style tool button — active = blue icon, no bg fill
  const ToolBtn = ({ tool, icon, label }) => {
    const isActive = activeTool === tool;
    return (
      <Tooltip title={label} arrow placement="right">
        <IconButton
          onClick={() => handleToolClick(tool)}
          sx={{
            width: btnSize,
            height: btnSize,
            borderRadius: '5px',
            color: isActive ? '#4262ff' : '#292929ff',
            bgcolor: isActive ? '#f0f0ff' : 'transparent',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: isActive ? '#e8e8ff' : '#f0f0f0',
              transform: 'scale(1.06)',
            },
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  };

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
            borderRadius: '5px',
            color: highlight ? '#fff' : '#292929ff',
            bgcolor: highlight ? '#4262ff' : 'transparent',
            transition: 'all 0.15s ease',
            '&:hover': {
              bgcolor: highlight ? '#2a4ad4' : '#f0f0f0',
              color: highlight ? '#fff' : '#292929ff',
              transform: 'scale(1.06)',
            },
            '&.Mui-disabled': {
              color: '#c5c5c5',
              bgcolor: 'transparent',
            },
          }}
        >
          {loading ? <CircularProgress size={16} sx={{ color: '#696880' }} /> : icon}
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <>
      {/* ════════════════════════════════════════════
          FLOATING LEFT TOOLBAR — Miro style
          Pill-shaped, rounded, with drop shadow
         ════════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'fixed',
          left: 12,
          top: 180,   /* announcement(36) + gap(12) + header(48) + gap(12) */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 0.75,
          px: 0.5,
          background: '#ffffff',
          borderRadius: '5px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          zIndex: 1000,
          width: 52,
          transition: 'box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
          },
        }}
      >
        {/* ── Top section: + button + tools ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>

          {/* Purple "+" creation button — Miro's signature */}
          <Tooltip title="Create" arrow placement="right">
            <IconButton
              onClick={() => setAssetPanelOpen(!isAssetPanelOpen)}
              sx={{
                width: 36,
                height: 36,
                borderRadius: 0.5,
                bgcolor: isAssetPanelOpen ? '#7b5ea7' : '#8338ec',
                color: '#fff',
                mb: 0.5,
                boxShadow: '0 2px 8px rgba(131,56,236,0.3)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '&:hover': {
                  bgcolor: '#7b2cbf',
                },
              }}
            >
              <Add sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>

          {/* Select (cursor) */}
          <ToolBtn tool="select" icon={<NearMe sx={{ fontSize: iconSize }} />} label="Select (V)" />

          {/* Sticky note */}
          <ActionBtn onClick={handleAddText} icon={<StickyNote2Outlined sx={{ fontSize: iconSize }} />} label="Sticky Note" />

          {/* Templates */}
          <ActionBtn onClick={() => handleAddShape('rect')} icon={<GridViewOutlined sx={{ fontSize: iconSize }} />} label="Templates" />

          {/* Frame */}
          <ActionBtn onClick={() => handleAddShape('rect')} icon={<AspectRatioOutlined sx={{ fontSize: iconSize }} />} label="Frame" />

          {/* Text */}
          <ActionBtn onClick={handleAddText} icon={<Title sx={{ fontSize: iconSize, fontWeight: 900 }} />} label="Text (T)" />

          {/* More tools */}
          <ActionBtn onClick={() => setAssetPanelOpen(!isAssetPanelOpen)} icon={<WidgetsOutlined sx={{ fontSize: iconSize }} />} label="More tools" highlight={isAssetPanelOpen} />

          {/* Shapes */}
          <ActionBtn onClick={() => handleAddShape('rect')} icon={<CropSquare sx={{ fontSize: iconSize }} />} label="Rectangle" />
          <ActionBtn onClick={() => handleAddShape('circle')} icon={<CircleOutlined sx={{ fontSize: iconSize }} />} label="Circle" />

          {/* Pen / Draw */}
          <ActionBtn onClick={() => handleToolClick('brush')} icon={<CreateOutlined sx={{ fontSize: iconSize }} />} label="Pen (P)" />

          {/* Comment */}
          <ActionBtn onClick={() => { }} icon={<ChatBubbleOutline sx={{ fontSize: iconSize }} />} label="Comment (C)" />

          {/* Emoji reactions */}
          <ActionBtn onClick={() => { }} icon={<EmojiEmotionsOutlined sx={{ fontSize: iconSize }} />} label="Reactions" />

          {/* Image upload */}
          <ActionBtn component="label" icon={<ImageIcon sx={{ fontSize: iconSize }} />} label="Upload Image">
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, canvas)} />
          </ActionBtn>

          {/* ── Contextual: crop + bg removal ── */}
          {isImageSelected && !isCropMode && (
            <>
              <Box sx={{ width: 28, height: 1, bgcolor: '#e6e6e6', my: 0.5 }} />
              <ActionBtn onClick={handleStartCrop} icon={<Crop sx={{ fontSize: iconSize }} />} label="Crop Image" />
              {hasBgRemoved ? (
                <ActionBtn onClick={() => revertBackgroundRemoval(canvas)} icon={<Replay sx={{ fontSize: iconSize }} />} label="Restore Background" loading={isRemovingBg} />
              ) : (
                <ActionBtn onClick={() => removeImageBackground(canvas)} icon={<AutoAwesome sx={{ fontSize: iconSize }} />} label="Remove Background (AI)" loading={isRemovingBg} highlight />
              )}
            </>
          )}
        </Box>

        {/* ── Bottom section: Undo / Redo ── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25, mt: 1 }}>
          {/* Separator */}
          <Box sx={{ width: 28, height: 1, bgcolor: '#e6e6e6', mb: 0.5 }} />

          {/* Fill color */}
          <Tooltip title="Fill Color" arrow placement="right">
            <Box sx={{
              width: 28, height: 28, borderRadius: '6px',
              border: '2px solid #d4d4d4', overflow: 'hidden', cursor: 'pointer',
              transition: 'all 0.15s ease',
              mb: 0.5,
              '&:hover': { transform: 'scale(1.1)' }
            }}>
              <input type="color" value={shapeFill} onChange={(e) => setShapeFill(e.target.value)}
                style={{ width: '150%', height: '150%', marginTop: '-25%', marginLeft: '-25%', cursor: 'pointer', border: 'none' }} />
            </Box>
          </Tooltip>

          <Tooltip title="Undo" arrow placement="right">
            <span>
              <IconButton onClick={undo} disabled={!canUndo()} sx={{
                width: 32, height: 32, borderRadius: '8px',
                color: '#696880',
                '&:hover': { bgcolor: '#f0f0f0' },
                '&.Mui-disabled': { color: '#c5c5c5' },
              }}>
                <Undo sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Redo" arrow placement="right">
            <span>
              <IconButton onClick={redo} disabled={!canRedo()} sx={{
                width: 32, height: 32, borderRadius: '8px',
                color: '#696880',
                '&:hover': { bgcolor: '#f0f0f0' },
                '&.Mui-disabled': { color: '#c5c5c5' },
              }}>
                <Redo sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* ===== FLOATING SIZE PANEL ===== */}
      {showSizePanel && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Fade in={showSizePanel} timeout={150}>
            <Box
              sx={{
                position: 'fixed',
                left: 72,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                background: '#ffffff',
                borderRadius: '12px',
                padding: '10px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                zIndex: 1001,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography sx={{ color: '#696880', fontSize: 11, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>Size</Typography>
                <Slider
                  size="small"
                  value={currentSizeTool === 'brush' ? brushSize : eraserSize}
                  onChange={(e, val) => currentSizeTool === 'brush' ? setBrushSize(val) : setEraserSize(val)}
                  min={1}
                  max={80}
                  sx={{ width: 100, color: '#4262ff', '& .MuiSlider-thumb': { width: 14, height: 14, bgcolor: '#fff', border: '2px solid #4262ff' } }}
                />
                <Typography sx={{ color: '#050038', fontSize: 12, fontWeight: 600, minWidth: 28, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: '4px', px: 1, py: 0.5, fontFamily: '"DM Sans", sans-serif' }}>
                  {currentSizeTool === 'brush' ? brushSize : eraserSize}
                </Typography>
              </Box>
              {currentSizeTool === 'brush' && (
                <>
                  <Box sx={{ width: 1, height: 24, bgcolor: '#e6e6e6' }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#696880', fontSize: 11, fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>Color</Typography>
                    <Box sx={{ width: 26, height: 26, borderRadius: '6px', border: '2px solid #e6e6e6', overflow: 'hidden', cursor: 'pointer' }}>
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

      {/* ===== CROP PANEL ===== */}
      {isCropMode && (
        <Fade in={true} timeout={150}>
          <Box
            sx={{
              position: 'fixed',
              left: 72,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              background: '#ffffff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
              zIndex: 1001,
              minWidth: 180,
            }}
          >
            <Typography sx={{ color: '#050038', fontSize: 13, fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }}>
              Crop Image
            </Typography>

            <Box>
              <Typography sx={{ color: '#696880', fontSize: 10, fontWeight: 600, mb: 1, textTransform: 'uppercase', fontFamily: '"DM Sans", sans-serif' }}>
                Aspect Ratio
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {Object.entries(ASPECT_RATIOS).map(([key, { label }]) => (
                  <Box
                    key={key}
                    onClick={() => handleAspectRatioChange(key)}
                    sx={{
                      px: 1.25, py: 0.5, borderRadius: '6px',
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      bgcolor: selectedRatio === key ? '#4262ff' : '#f5f5f5',
                      color: selectedRatio === key ? '#fff' : '#696880',
                      transition: 'all 0.12s ease',
                      fontFamily: '"DM Sans", sans-serif',
                      '&:hover': { bgcolor: selectedRatio === key ? '#4262ff' : '#ebebeb' }
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Typography sx={{ color: '#696880', fontSize: 10, fontWeight: 600, mb: 1, textTransform: 'uppercase', fontFamily: '"DM Sans", sans-serif' }}>
                Rotate
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Rotate Left" arrow>
                  <IconButton onClick={() => rotateCropImage(canvas, -90)} size="small"
                    sx={{ bgcolor: '#f5f5f5', borderRadius: '8px', '&:hover': { bgcolor: '#ebebeb' } }}>
                    <RotateRight sx={{ fontSize: 18, transform: 'scaleX(-1)' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Rotate Right" arrow>
                  <IconButton onClick={() => rotateCropImage(canvas, 90)} size="small"
                    sx={{ bgcolor: '#f5f5f5', borderRadius: '8px', '&:hover': { bgcolor: '#ebebeb' } }}>
                    <RotateRight sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#f0f0f0' }} />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={handleCancelCrop} startIcon={<Close sx={{ fontSize: 16 }} />} size="small"
                sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 12, color: '#696880', bgcolor: '#f5f5f5', fontFamily: '"DM Sans", sans-serif', '&:hover': { bgcolor: '#ebebeb' } }}>
                Cancel
              </Button>
              <Button onClick={handleApplyCrop} startIcon={<Check sx={{ fontSize: 16 }} />} size="small" variant="contained" disableElevation
                sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', fontWeight: 600, fontSize: 12, bgcolor: '#4262ff', fontFamily: '"DM Sans", sans-serif', '&:hover': { bgcolor: '#2a4ad4' } }}>
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