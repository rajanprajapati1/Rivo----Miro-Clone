import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Slider,
  Menu,
  Typography,
  Divider
} from '@mui/material';
import {
  Undo,
  Redo,
  FileDownloadOutlined,
  DeleteOutline,
  TuneOutlined
} from '@mui/icons-material';
import useStore from './store/useStore';
import { exportToWebP, clearCanvas } from './utils/canvasUtils';

const TopBar = () => {
  const {
    canvas,
    undo,
    redo,
    canUndo,
    canRedo,
    exportQuality,
    setExportQuality,
    backgroundColor,
    setBackgroundColor,
    saveToHistory
  } = useStore();

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleClear = () => {
    if (window.confirm('Clear canvas?')) {
      clearCanvas(canvas);
    }
  };

  const handleBackgroundChange = (e) => {
    setBackgroundColor(e.target.value);
    if (canvas) {
      canvas.backgroundColor = e.target.value;
      canvas.requestRenderAll();
      saveToHistory();
    }
  };

  const handleExport = (options = {}) => {
    exportToWebP(canvas, options);
    setMenuAnchor(null);
  };

  const btnSize = 32;
  const iconSize = 18;

  const btnStyle = {
    width: btnSize,
    height: btnSize,
    color: '#71717a',
    transition: 'all 0.15s ease',
    '&:hover': { bgcolor: '#f4f4f5', color: '#18181b', transform: 'scale(1.05)' },
    '&.Mui-disabled': { color: '#d4d4d8' },
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          background: '#ffffff',
          borderRadius: '12px',
          padding: '6px 8px',
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          zIndex: 1001,
        }}
      >
        <Tooltip title="Undo" arrow>
          <span>
            <IconButton onClick={undo} disabled={!canUndo()} sx={btnStyle}>
              <Undo sx={{ fontSize: iconSize }} />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Redo" arrow>
          <span>
            <IconButton onClick={redo} disabled={!canRedo()} sx={btnStyle}>
              <Redo sx={{ fontSize: iconSize }} />
            </IconButton>
          </span>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#e4e4e7' }} />

        <Tooltip title="Background" arrow>
          <Box sx={{
            width: 26, height: 26, borderRadius: '6px', border: '1px solid #e4e4e7',
            overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: '#a1a1aa', transform: 'scale(1.05)' }
          }}>
            <input type="color" value={backgroundColor} onChange={handleBackgroundChange}
              style={{ width: '150%', height: '150%', marginTop: '-25%', marginLeft: '-25%', cursor: 'pointer', border: 'none' }} />
          </Box>
        </Tooltip>

        <Tooltip title="Clear" arrow>
          <IconButton onClick={handleClear} sx={{ ...btnStyle, color: '#ef4444', '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' } }}>
            <DeleteOutline sx={{ fontSize: iconSize }} />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: '#e4e4e7' }} />

        <Tooltip title="Settings" arrow>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} sx={btnStyle}>
            <TuneOutlined sx={{ fontSize: iconSize }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Export" arrow>
          <IconButton onClick={() => handleExport()}
            sx={{
              width: btnSize, height: btnSize, bgcolor: '#18181b', color: '#fff', borderRadius: '8px',
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: '#27272a', transform: 'scale(1.05)' },
            }}>
            <FileDownloadOutlined sx={{ fontSize: iconSize }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Export Settings Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            background: '#ffffff',
            width: 240,
            borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
            mt: 1.5,
            overflow: 'hidden',
            p: 0,
          }
        }}
      >
        {/* Quality Section */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography
              sx={{
                color: '#71717a',
                fontWeight: 600,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Export Quality
            </Typography>
            <Typography
              sx={{
                color: '#18181b',
                fontWeight: 700,
                fontSize: 13,
                bgcolor: '#f4f4f5',
                px: 1,
                py: 0.25,
                borderRadius: '6px',
              }}
            >
              {Math.round(exportQuality * 100)}%
            </Typography>
          </Box>

          <Slider
            value={exportQuality}
            onChange={(e, val) => setExportQuality(val)}
            min={0.1}
            max={1}
            step={0.1}
            sx={{
              color: '#18181b',
              height: 6,
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                bgcolor: '#fff',
                border: '2px solid #18181b',
                '&:hover': { boxShadow: '0 0 0 6px rgba(0,0,0,0.08)' },
              },
              '& .MuiSlider-track': { border: 'none' },
              '& .MuiSlider-rail': { opacity: 0.15 },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: '#f4f4f5' }} />

        {/* Export Options */}
        <Box sx={{ py: 1.5, px: 1.5 }}>
          {[
            { label: 'Export Full Canvas', desc: 'Save entire canvas' },
            { label: 'Transparent BG', desc: 'Remove background' },
            { label: 'Trim to Content', desc: 'Crop whitespace' },
          ].map((item, i) => (
            <Box
              key={item.label}
              onClick={() => handleExport(
                i === 1 ? { transparentBackground: true } :
                  i === 2 ? { trimWhitespace: true } : {}
              )}
              sx={{
                cursor: 'pointer',
                px: 1.5,
                py: 1.25,
                borderRadius: '10px',
                transition: 'all 0.15s ease',
                '&:hover': {
                  bgcolor: '#f8f8f8',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                  bgcolor: '#f4f4f5',
                }
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: '#18181b',
                  fontSize: 13,
                  mb: 0.25,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  color: '#a1a1aa',
                  fontSize: 11,
                }}
              >
                {item.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Menu>
    </>
  );
};

export default TopBar;