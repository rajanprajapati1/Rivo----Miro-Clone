import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  Divider,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  Fade
} from '@mui/material';
import {
  DeleteOutline,
  KeyboardArrowUp,
  KeyboardArrowDown,
  VerticalAlignTop,
  VerticalAlignBottom,
  ContentCopy,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  Flip,
  RotateRight,
  Close,
  Layers as LayersIcon,
  CropSquare,
  CircleOutlined,
  TextFields,
  Image as ImageIcon,
  Gesture
} from '@mui/icons-material';
import useStore from './store/useStore';
import {
  deleteSelected,
  duplicateSelected,
  flipObject,
  moveLayer,
  applyFilter,
  resetFilters
} from './utils/canvasUtils';

const FONTS = ['Arial', 'Helvetica', 'Georgia', 'Verdana', 'Courier New'];

/* ─── Miro-style slider theme ─── */
const miroSlider = {
  color: '#4262ff',
  height: 3,
  '& .MuiSlider-thumb': {
    width: 14,
    height: 14,
    bgcolor: '#fff',
    border: '2px solid #4262ff',
    boxShadow: '0 1px 4px rgba(66,98,255,0.25)',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 6px rgba(66,98,255,0.12)',
    },
  },
  '& .MuiSlider-track': { border: 'none' },
  '& .MuiSlider-rail': { opacity: 0.18, bgcolor: '#696880' },
};

/* ─── Object type icon helper ─── */
const getTypeIcon = (type) => {
  switch (type) {
    case 'i-text': case 'text': return <TextFields sx={{ fontSize: 13 }} />;
    case 'image': return <ImageIcon sx={{ fontSize: 13 }} />;
    case 'rect': return <CropSquare sx={{ fontSize: 13 }} />;
    case 'circle': case 'ellipse': return <CircleOutlined sx={{ fontSize: 13 }} />;
    case 'path': return <Gesture sx={{ fontSize: 13 }} />;
    default: return <CropSquare sx={{ fontSize: 13 }} />;
  }
};

const getTypeLabel = (type) => {
  switch (type) {
    case 'i-text': return 'Text';
    case 'text': return 'Text';
    case 'image': return 'Image';
    case 'rect': return 'Rectangle';
    case 'circle': return 'Circle';
    case 'ellipse': return 'Ellipse';
    case 'path': return 'Path';
    case 'triangle': return 'Triangle';
    default: return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Object';
  }
};

const SettingsPanel = () => {
  const {
    selectedObject,
    canvas,
    layers,
    saveToHistory,
    updateLayers,
    setSelectedObject
  } = useStore();

  const [activeTab, setActiveTab] = useState(0);
  const [filterValues, setFilterValues] = useState({ brightness: 0, contrast: 0, saturation: 0, blur: 0 });

  if (!selectedObject) return null;

  const handleColorChange = (e) => { selectedObject.set('fill', e.target.value); canvas.requestRenderAll(); saveToHistory(); };
  const handleStrokeChange = (e) => { selectedObject.set('stroke', e.target.value); canvas.requestRenderAll(); saveToHistory(); };
  const handleOpacityChange = (e, val) => { selectedObject.set('opacity', val); canvas.requestRenderAll(); saveToHistory(); };
  const handleRotationChange = (e, val) => { selectedObject.rotate(val); canvas.requestRenderAll(); saveToHistory(); };
  const handleClose = () => { canvas.discardActiveObject(); canvas.requestRenderAll(); setSelectedObject(null); };
  const handleFontChange = (e) => { selectedObject.set('fontFamily', e.target.value); canvas.requestRenderAll(); saveToHistory(); };
  const handleFontSizeChange = (e) => { selectedObject.set('fontSize', parseInt(e.target.value) || 20); canvas.requestRenderAll(); saveToHistory(); };
  const handleFilterChange = (filterType, value) => { setFilterValues(prev => ({ ...prev, [filterType]: value })); applyFilter(canvas, filterType, value); };

  const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';
  const isImage = selectedObject.type === 'image';

  /* ─── Shared styles ─── */
  const sectionLabel = {
    color: '#696880',
    fontWeight: 600,
    fontSize: 10.5,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontFamily: '"DM Sans", sans-serif',
    mb: 1,
    display: 'block',
  };

  const actionBtn = {
    width: 34,
    height: 34,
    borderRadius: '8px',
    color: '#050038',
    bgcolor: '#f5f5fa',
    border: 'none',
    transition: 'all 0.15s ease',
    '&:hover': {
      bgcolor: '#e8e8f0',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
  };

  return (
    <Fade in={true} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          right: 12,
          top: 100,
          width: 272,
          maxHeight: 'calc(100vh - 120px)',
          background: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          /* Miro scrollbar */
          '& ::-webkit-scrollbar': { width: 4 },
          '& ::-webkit-scrollbar-track': { background: 'transparent' },
          '& ::-webkit-scrollbar-thumb': { background: '#d4d4d8', borderRadius: 2 },
        }}
      >
        {/* ═══ Header ═══ */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2, py: 1.25,
          borderBottom: '1px solid #f0f0f5',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Type icon badge */}
            <Box sx={{
              width: 24, height: 24, borderRadius: '6px',
              bgcolor: '#f0f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#4262ff',
            }}>
              {getTypeIcon(selectedObject.type)}
            </Box>
            <Typography sx={{
              fontWeight: 700, color: '#050038', fontSize: 13,
              fontFamily: '"DM Sans", sans-serif',
              letterSpacing: '-0.01em',
            }}>
              {getTypeLabel(selectedObject.type)}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: '#9795b5', width: 26, height: 26, borderRadius: '6px',
              '&:hover': { color: '#050038', bgcolor: '#f5f5fa' },
            }}
          >
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* ═══ Tabs ═══ */}
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{
            minHeight: 36,
            borderBottom: '1px solid #f0f0f5',
            '& .MuiTab-root': {
              minHeight: 36, fontSize: 11.5, fontWeight: 600,
              color: '#9795b5', textTransform: 'none',
              fontFamily: '"DM Sans", sans-serif',
              py: 0,
              '&.Mui-selected': { color: '#050038' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#4262ff', height: 2, borderRadius: '2px 2px 0 0' },
          }}
        >
          <Tab label="Properties" />
          <Tab label="Layers" />
        </Tabs>

        {/* ═══ Content ═══ */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', p: 2 }}>
          {activeTab === 0 && (
            <>
              {/* ── Fill Color ── */}
              {!isImage && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={sectionLabel}>Fill</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* Color swatch */}
                    <Box sx={{
                      width: 36, height: 36, borderRadius: '8px',
                      border: '2px solid #e8e8f0',
                      overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                      transition: 'border-color 0.15s ease',
                      '&:hover': { borderColor: '#4262ff' },
                    }}>
                      <input
                        type="color"
                        value={selectedObject.fill || '#000000'}
                        onChange={handleColorChange}
                        style={{
                          width: '150%', height: '150%',
                          marginTop: '-25%', marginLeft: '-25%',
                          cursor: 'pointer', border: 'none',
                        }}
                      />
                    </Box>
                    {/* Hex value */}
                    <Box sx={{
                      flex: 1, height: 36, borderRadius: '8px',
                      bgcolor: '#f5f5fa', display: 'flex', alignItems: 'center',
                      px: 1.5,
                    }}>
                      <Typography sx={{
                        fontSize: 12, fontWeight: 600, color: '#050038',
                        fontFamily: '"DM Sans", monospace',
                        letterSpacing: '0.02em',
                      }}>
                        {(selectedObject.fill || '#000000').toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* ── Stroke ── */}
              {!isImage && !isText && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={sectionLabel}>Stroke</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Box sx={{
                      width: 36, height: 36, borderRadius: '8px',
                      border: '2px solid #e8e8f0',
                      overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                      transition: 'border-color 0.15s ease',
                      '&:hover': { borderColor: '#4262ff' },
                    }}>
                      <input type="color" value={selectedObject.stroke || '#000000'} onChange={handleStrokeChange}
                        style={{ width: '150%', height: '150%', marginTop: '-25%', marginLeft: '-25%', cursor: 'pointer', border: 'none' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Slider
                        value={selectedObject.strokeWidth || 0} min={0} max={20} step={1}
                        onChange={(e, val) => { selectedObject.set('strokeWidth', val); canvas.requestRenderAll(); saveToHistory(); }}
                        sx={miroSlider}
                      />
                    </Box>
                    <Box sx={{
                      minWidth: 32, height: 28, borderRadius: '6px', bgcolor: '#f5f5fa',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#050038', fontFamily: '"DM Sans", sans-serif' }}>
                        {selectedObject.strokeWidth || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* ── Text Settings ── */}
              {isText && (
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" sx={sectionLabel}>Typography</Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 1.25 }}>
                    <Select
                      value={selectedObject.fontFamily || 'Arial'}
                      onChange={handleFontChange}
                      sx={{
                        borderRadius: '8px', fontSize: 12.5, fontWeight: 500,
                        fontFamily: '"DM Sans", sans-serif',
                        bgcolor: '#f5f5fa',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e6' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4262ff', borderWidth: 1.5 },
                        '& .MuiSelect-select': { py: 1 },
                      }}
                    >
                      {FONTS.map(f => <MenuItem key={f} value={f} sx={{ fontSize: 12.5, fontFamily: f }}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={selectedObject.fontSize || 20}
                      onChange={handleFontSizeChange}
                      InputProps={{
                        sx: {
                          borderRadius: '8px', fontSize: 12.5, fontWeight: 600,
                          bgcolor: '#f5f5fa',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e6' },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4262ff', borderWidth: 1.5 },
                        },
                        startAdornment: (
                          <Typography sx={{ fontSize: 10, color: '#9795b5', fontWeight: 600, mr: 0.75, whiteSpace: 'nowrap' }}>
                            SIZE
                          </Typography>
                        ),
                      }}
                      sx={{ '& input': { py: 1 } }}
                    />
                  </Box>
                </Box>
              )}

              {/* ── Image Filters ── */}
              {isImage && (
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ ...sectionLabel, mb: 0 }}>Adjustments</Typography>
                    <Typography
                      variant="caption"
                      onClick={() => { setFilterValues({ brightness: 0, contrast: 0, saturation: 0, blur: 0 }); resetFilters(canvas); }}
                      sx={{
                        color: '#4262ff', cursor: 'pointer', fontWeight: 600, fontSize: 10.5,
                        fontFamily: '"DM Sans", sans-serif',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Reset
                    </Typography>
                  </Box>
                  {['brightness', 'contrast', 'saturation'].map(f => (
                    <Box key={f} sx={{ mb: 1.25 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                        <Typography sx={{
                          color: '#696880', fontSize: 11, fontWeight: 500,
                          textTransform: 'capitalize', fontFamily: '"DM Sans", sans-serif',
                        }}>
                          {f}
                        </Typography>
                        <Typography sx={{
                          fontSize: 10.5, fontWeight: 700, color: '#050038',
                          bgcolor: '#f5f5fa', px: 0.75, py: 0.125, borderRadius: '4px',
                          fontFamily: '"DM Sans", sans-serif', minWidth: 32, textAlign: 'center',
                        }}>
                          {filterValues[f] > 0 ? '+' : ''}{Math.round(filterValues[f] * 100)}
                        </Typography>
                      </Box>
                      <Slider
                        value={filterValues[f]} min={-1} max={1} step={0.1}
                        onChange={(e, v) => handleFilterChange(f, v)}
                        sx={miroSlider}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* ── Divider ── */}
              <Divider sx={{ borderColor: '#f0f0f5', my: 0.5 }} />

              {/* ── Opacity ── */}
              <Box sx={{ mb: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography sx={{
                    color: '#696880', fontSize: 11, fontWeight: 600,
                    fontFamily: '"DM Sans", sans-serif',
                  }}>
                    Opacity
                  </Typography>
                  <Box sx={{
                    bgcolor: '#f5f5fa', borderRadius: '5px', px: 1, py: 0.25,
                    minWidth: 40, textAlign: 'center',
                  }}>
                    <Typography sx={{
                      fontSize: 11, fontWeight: 700, color: '#050038',
                      fontFamily: '"DM Sans", sans-serif',
                    }}>
                      {Math.round((selectedObject.opacity || 1) * 100)}%
                    </Typography>
                  </Box>
                </Box>
                <Slider
                  value={selectedObject.opacity || 1} min={0} max={1} step={0.05}
                  onChange={handleOpacityChange}
                  sx={miroSlider}
                />
              </Box>

              {/* ── Rotation ── */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                  <Typography sx={{
                    color: '#696880', fontSize: 11, fontWeight: 600,
                    fontFamily: '"DM Sans", sans-serif',
                  }}>
                    Rotation
                  </Typography>
                  <Box sx={{
                    bgcolor: '#f5f5fa', borderRadius: '5px', px: 1, py: 0.25,
                    minWidth: 40, textAlign: 'center',
                  }}>
                    <Typography sx={{
                      fontSize: 11, fontWeight: 700, color: '#050038',
                      fontFamily: '"DM Sans", sans-serif',
                    }}>
                      {Math.round(selectedObject.angle || 0)}°
                    </Typography>
                  </Box>
                </Box>
                <Slider
                  value={selectedObject.angle || 0} min={0} max={360} step={1}
                  onChange={handleRotationChange}
                  sx={miroSlider}
                />
              </Box>

              {/* ── Divider ── */}
              <Divider sx={{ borderColor: '#f0f0f5', my: 0.5 }} />

              {/* ── Transform Actions ── */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="caption" sx={sectionLabel}>Transform</Typography>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Tooltip title="Flip Horizontal" arrow placement="top">
                    <IconButton onClick={() => flipObject(canvas, 'horizontal')} sx={actionBtn}>
                      <Flip sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Flip Vertical" arrow placement="top">
                    <IconButton onClick={() => flipObject(canvas, 'vertical')} sx={actionBtn}>
                      <Flip sx={{ fontSize: 16, transform: 'rotate(90deg)' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rotate 90°" arrow placement="top">
                    <IconButton onClick={() => { selectedObject.rotate((selectedObject.angle || 0) + 90); canvas.requestRenderAll(); saveToHistory(); }} sx={actionBtn}>
                      <RotateRight sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Duplicate" arrow placement="top">
                    <IconButton onClick={() => duplicateSelected(canvas)} sx={actionBtn}>
                      <ContentCopy sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* ── Layer Order ── */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" sx={sectionLabel}>Arrange</Typography>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Tooltip title="Move Up" arrow placement="top">
                    <IconButton onClick={() => moveLayer(canvas, 'up')} sx={{ ...actionBtn, flex: 1 }}>
                      <KeyboardArrowUp sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Move Down" arrow placement="top">
                    <IconButton onClick={() => moveLayer(canvas, 'down')} sx={{ ...actionBtn, flex: 1 }}>
                      <KeyboardArrowDown sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Bring to Front" arrow placement="top">
                    <IconButton onClick={() => moveLayer(canvas, 'front')} sx={{ ...actionBtn, flex: 1 }}>
                      <VerticalAlignTop sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Send to Back" arrow placement="top">
                    <IconButton onClick={() => moveLayer(canvas, 'back')} sx={{ ...actionBtn, flex: 1 }}>
                      <VerticalAlignBottom sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* ── Delete ── */}
              <Button
                variant="text"
                startIcon={<DeleteOutline sx={{ fontSize: '16px !important' }} />}
                fullWidth
                onClick={() => deleteSelected(canvas)}
                size="small"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 12.5,
                  py: 1,
                  color: '#dc2626',
                  bgcolor: '#fef2f2',
                  fontFamily: '"DM Sans", sans-serif',
                  border: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#fde8e8',
                    boxShadow: 'none',
                  },
                }}
              >
                Delete
              </Button>
            </>
          )}

          {activeTab === 1 && <LayersList layers={layers} canvas={canvas} setSelectedObject={setSelectedObject} />}
        </Box>
      </Box>
    </Fade>
  );
};

/* ═══ Layers List ═══ */
const LayersList = ({ layers, canvas, setSelectedObject }) => {
  const { updateLayers } = useStore();

  if (!layers.length) {
    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: 100, color: '#9795b5',
      }}>
        <LayersIcon sx={{ fontSize: 28, mb: 1, opacity: 0.35 }} />
        <Typography sx={{ fontSize: 12, fontWeight: 500, fontFamily: '"DM Sans", sans-serif' }}>
          No layers yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {layers.map((layer, i) => (
        <Box
          key={layer.id}
          onClick={() => {
            canvas.setActiveObject(layer.object);
            canvas.requestRenderAll();
            setSelectedObject(layer.object);
          }}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 1.25, py: 0.875,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
            bgcolor: 'transparent',
            '&:hover': { bgcolor: '#f5f5fa' },
          }}
        >
          {/* Layer index */}
          <Box sx={{
            width: 20, height: 20, borderRadius: '5px',
            bgcolor: '#f0f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Typography sx={{ color: '#4262ff', fontWeight: 700, fontSize: 9, fontFamily: '"DM Sans", sans-serif' }}>
              {layers.length - i}
            </Typography>
          </Box>

          {/* Type icon */}
          <Box sx={{ color: '#9795b5', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {getTypeIcon(layer.type)}
          </Box>

          {/* Name */}
          <Typography sx={{
            flex: 1, fontSize: 12, fontWeight: 500, color: '#050038',
            fontFamily: '"DM Sans", sans-serif',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {layer.name || getTypeLabel(layer.type)}
          </Typography>

          {/* Visibility toggle */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              layer.object.set('visible', !layer.visible);
              canvas.requestRenderAll();
              updateLayers();
            }}
            sx={{
              color: layer.visible ? '#9795b5' : '#d4d4d8',
              p: 0.25, width: 24, height: 24, borderRadius: '5px',
              '&:hover': { color: '#050038', bgcolor: '#f0f0f5' },
            }}
          >
            {layer.visible
              ? <Visibility sx={{ fontSize: 14 }} />
              : <VisibilityOff sx={{ fontSize: 14 }} />
            }
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default SettingsPanel;