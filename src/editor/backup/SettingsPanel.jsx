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
  Layers as LayersIcon
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

  const labelStyle = { color: '#71717a', fontWeight: 600, mb: 0.5, display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.3 };
  const actionBtn = { width: 28, height: 28, border: '1px solid #e4e4e7', borderRadius: '6px', color: '#52525b', transition: 'all 0.15s', '&:hover': { borderColor: '#a1a1aa', bgcolor: '#fafafa', transform: 'scale(1.05)' } };

  return (
    <Fade in={true} timeout={200}>
      <Box
        sx={{
          position: 'fixed',
          right: 16,
          top: 100,
          width: 280,
          maxHeight: 'calc(100vh - 90px)',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 1, borderBottom: '1px solid #f4f4f5' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#18181b', textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.3 }}>
            {selectedObject.type || 'Object'}
          </Typography>
          <IconButton size="small" onClick={handleClose} sx={{ color: '#a1a1aa', p: 0.25, '&:hover': { color: '#18181b' } }}>
            <Close sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="fullWidth"
          sx={{
            minHeight: 32,
            borderBottom: '1px solid #f4f4f5',
            '& .MuiTab-root': { minHeight: 32, fontSize: 10, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', py: 0, '&.Mui-selected': { color: '#18181b' } },
            '& .MuiTabs-indicator': { backgroundColor: '#18181b', height: 1.5 }
          }}>
          <Tab label="Properties" />
          <Tab label="Layers" />
        </Tabs>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', p: 1.5 }}>
          {activeTab === 0 && (
            <>
              {/* Fill */}
              {!isImage && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={labelStyle}>Fill Color</Typography>

                  <Box
                    sx={{
                      width: '100%',
                      height: 28,
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      // Remove all focus outlines
                      '& input[type=color]': {
                        border: 'none !important',
                        outline: 'none !important',
                      }
                    }}
                  >
                    <input
                      type="color"
                      value={selectedObject.fill || '#000000'}
                      onChange={handleColorChange}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        padding: 0,
                        margin: 0,
                        // Completely remove default UI (Chrome/Firefox/Safari)
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                </Box>
              )}


              {/* Stroke */}
              {!isImage && !isText && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={labelStyle}>Stroke</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '6px', border: '1px solid #e4e4e7', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}>
                      <input type="color" value={selectedObject.stroke || '#000000'} onChange={handleStrokeChange}
                        style={{ width: '150%', height: '150%', marginTop: '-25%', marginLeft: '-25%', cursor: 'pointer', border: 'none' }} />
                    </Box>
                    <Slider value={selectedObject.strokeWidth || 0} min={0} max={20} step={1}
                      onChange={(e, val) => { selectedObject.set('strokeWidth', val); canvas.requestRenderAll(); saveToHistory(); }}
                      sx={{ color: '#18181b', flex: 1, '& .MuiSlider-thumb': { width: 12, height: 12 } }} />
                  </Box>
                </Box>
              )}

              {/* Text */}
              {isText && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={labelStyle}>Font</Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                    <Select value={selectedObject.fontFamily || 'Arial'} onChange={handleFontChange}
                      sx={{ borderRadius: '6px', fontSize: 12, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e4e4e7' }, '& .MuiSelect-select': { py: 0.75 } }}>
                      {FONTS.map(f => <MenuItem key={f} value={f} sx={{ fontSize: 12 }}>{f}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField label="Size" type="number" size="small" fullWidth value={selectedObject.fontSize || 20} onChange={handleFontSizeChange}
                    InputProps={{ sx: { borderRadius: '6px', fontSize: 12 } }} sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e4e4e7' }, '& input': { py: 0.75 } }} />
                </Box>
              )}

              {/* Filters */}
              {isImage && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={labelStyle}>Filters</Typography>
                    <Typography variant="caption" onClick={() => { setFilterValues({ brightness: 0, contrast: 0, saturation: 0, blur: 0 }); resetFilters(canvas); }}
                      sx={{ color: '#18181b', cursor: 'pointer', fontWeight: 600, fontSize: 9, '&:hover': { textDecoration: 'underline' } }}>Reset</Typography>
                  </Box>
                  {['brightness', 'contrast', 'saturation'].map(f => (
                    <Box key={f} sx={{ mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#a1a1aa', fontSize: 9, textTransform: 'capitalize' }}>{f}</Typography>
                      <Slider value={filterValues[f]} min={-1} max={1} step={0.1} onChange={(e, v) => handleFilterChange(f, v)}
                        sx={{ color: '#18181b', '& .MuiSlider-thumb': { width: 10, height: 10 } }} />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Opacity */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={labelStyle}>Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%</Typography>
                <Slider value={selectedObject.opacity || 1} min={0} max={1} step={0.05} onChange={handleOpacityChange}
                  sx={{ color: '#18181b', '& .MuiSlider-thumb': { width: 12, height: 12 } }} />
              </Box>

              {/* Rotation */}
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={labelStyle}>Rotation: {Math.round(selectedObject.angle || 0)}°</Typography>
                <Slider value={selectedObject.angle || 0} min={0} max={360} step={1} onChange={handleRotationChange}
                  sx={{ color: '#18181b', '& .MuiSlider-thumb': { width: 12, height: 12 } }} />
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
                <Tooltip title="Flip H" arrow><IconButton onClick={() => flipObject(canvas, 'horizontal')} sx={actionBtn}><Flip sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                <Tooltip title="Flip V" arrow><IconButton onClick={() => flipObject(canvas, 'vertical')} sx={actionBtn}><Flip sx={{ fontSize: 14, transform: 'rotate(90deg)' }} /></IconButton></Tooltip>
                <Tooltip title="Rotate" arrow><IconButton onClick={() => { selectedObject.rotate((selectedObject.angle || 0) + 90); canvas.requestRenderAll(); saveToHistory(); }} sx={actionBtn}><RotateRight sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                <Tooltip title="Copy" arrow><IconButton onClick={() => duplicateSelected(canvas)} sx={actionBtn}><ContentCopy sx={{ fontSize: 14 }} /></IconButton></Tooltip>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
                <Tooltip title="Up" arrow><IconButton onClick={() => moveLayer(canvas, 'up')} sx={{ ...actionBtn, flex: 1 }}><KeyboardArrowUp sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                <Tooltip title="Down" arrow><IconButton onClick={() => moveLayer(canvas, 'down')} sx={{ ...actionBtn, flex: 1 }}><KeyboardArrowDown sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                <Tooltip title="Front" arrow><IconButton onClick={() => moveLayer(canvas, 'front')} sx={{ ...actionBtn, flex: 1 }}><VerticalAlignTop sx={{ fontSize: 14 }} /></IconButton></Tooltip>
                <Tooltip title="Back" arrow><IconButton onClick={() => moveLayer(canvas, 'back')} sx={{ ...actionBtn, flex: 1 }}><VerticalAlignBottom sx={{ fontSize: 14 }} /></IconButton></Tooltip>
              </Box>

              <Button variant="contained" startIcon={<DeleteOutline sx={{ fontSize: 16 }} />} fullWidth onClick={() => deleteSelected(canvas)} size="small"
                sx={{ borderRadius: '6px', textTransform: 'none', fontWeight: 600, fontSize: 12, py: 0.75, bgcolor: '#ef4444', boxShadow: 'none', '&:hover': { bgcolor: '#dc2626', boxShadow: 'none' } }}>
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

const LayersList = ({ layers, canvas, setSelectedObject }) => {
  const { updateLayers } = useStore();

  if (!layers.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 80, color: '#a1a1aa' }}>
        <LayersIcon sx={{ fontSize: 24, mb: 0.5, opacity: 0.5 }} />
        <Typography variant="caption" sx={{ fontSize: 10 }}>No layers</Typography>
      </Box>
    );
  }

  return (
    <List dense sx={{ p: 0 }}>
      {layers.map((layer, i) => (
        <ListItem key={layer.id} button onClick={() => { canvas.setActiveObject(layer.object); canvas.requestRenderAll(); setSelectedObject(layer.object); }}
          sx={{ borderRadius: '6px', mb: 0.25, py: 0.5, border: '1px solid #f4f4f5', '&:hover': { bgcolor: '#fafafa' } }}>
          <ListItemIcon sx={{ minWidth: 20 }}>
            <Typography variant="caption" sx={{ color: '#a1a1aa', fontWeight: 600, fontSize: 9 }}>{layers.length - i}</Typography>
          </ListItemIcon>
          <ListItemText primary={layer.name || layer.type} primaryTypographyProps={{ fontSize: 11, fontWeight: 500, color: '#18181b' }} />
          <ListItemSecondaryAction>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); layer.object.set('visible', !layer.visible); canvas.requestRenderAll(); updateLayers(); }} sx={{ color: '#a1a1aa', p: 0.25 }}>
              {layer.visible ? <Visibility sx={{ fontSize: 12 }} /> : <VisibilityOff sx={{ fontSize: 12 }} />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default SettingsPanel;