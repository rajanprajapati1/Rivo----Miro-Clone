import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Slider,
  Menu,
  Typography,
  Divider,
  Button
} from '@mui/material';
import {
  Undo,
  Redo,
  FileDownloadOutlined,
  DeleteOutline,
  TuneOutlined,
  MenuOutlined,
  MoreHoriz,
  IosShare,
  PlayArrow,
  PeopleOutline,
  Close,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatListBulleted,
  LinkOutlined,
  FormatColorText,
  FormatColorFill,
  LockOutlined,
  ContentCopy,
  MoreVert,
  OpenInNew,
  EmojiEmotionsOutlined,
  KeyboardArrowDown
} from '@mui/icons-material';
import useStore from './store/useStore';
import { exportToWebP, clearCanvas, duplicateSelected, deleteSelected } from './utils/canvasUtils';

/* ─── Shared floating-bar styles ─── */
const floatingBar = {
  display: 'flex',
  alignItems: 'center',
  background: '#ffffff',
  borderRadius: '4px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.17), 0 0 0 1px rgba(0,0,0,0.04)',
  height: 48,
  px: 1,
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
  },
};

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
    saveToHistory,
    selectedObject,
    setSelectedObject
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

  /* ── Text formatting helpers ── */
  const isText = selectedObject?.type === 'i-text' || selectedObject?.type === 'text';

  const toggleBold = () => {
    if (!selectedObject || !isText) return;
    selectedObject.set('fontWeight', selectedObject.fontWeight === 'bold' ? 'normal' : 'bold');
    canvas.requestRenderAll();
    saveToHistory();
  };

  const toggleItalic = () => {
    if (!selectedObject || !isText) return;
    selectedObject.set('fontStyle', selectedObject.fontStyle === 'italic' ? 'normal' : 'italic');
    canvas.requestRenderAll();
    saveToHistory();
  };

  const toggleUnderline = () => {
    if (!selectedObject || !isText) return;
    selectedObject.set('underline', !selectedObject.underline);
    canvas.requestRenderAll();
    saveToHistory();
  };

  const setAlign = (align) => {
    if (!selectedObject || !isText) return;
    selectedObject.set('textAlign', align);
    canvas.requestRenderAll();
    saveToHistory();
  };

  return (
    <>
      {/* ════════════════════════════════════════════
          ANNOUNCEMENT BAR — Miro Canvas 26 style
         ════════════════════════════════════════════ */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          background: 'radial-gradient(121.35% 135.23% at 8.53% 12.49%, rgb(255, 221, 51) 41.91%, rgb(249, 205, 77) 57.26%, rgb(231, 157, 153) 72.25%, rgb(208, 93, 255) 82.18%, rgb(43, 77, 248) 99.4%) left top / 100% 140%',
          zIndex: 1200,
          px: 2,
          overflow: 'hidden',
          fontStyle: 'italic'
        }}
      >
        {/* Brand badge */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 0.75,
          borderRadius: '6px', px: 1, py: 0.25,
        }}>
          <Typography sx={{
            color: '#1c1c1e', fontWeight: "900", fontSize: 14, letterSpacing: '0.06em',
          }}>
            CANVAS
          </Typography>
          <Box sx={{
            bgcolor: '#fff', color: '#e65100', borderRadius: '4px', px: 0.6, py: 0.1,
            fontWeight: 900, fontSize: 10, lineHeight: 1.4,
          }}>
            26
          </Box>
        </Box>

        {/* Promo text */}
        <Typography sx={{
          color: '#1c1c1e',
          fontSize: 12.5,
          fontWeight: 600,
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '-0.01em',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}>
          Don't wait for the recap. Catch the latest launches from the Canvas 26 keynote, streaming live on May 19.
        </Typography>

        {/* CTA */}
        <Button
          size="small"
          variant="contained"
          disableElevation
          endIcon={<OpenInNew sx={{ fontSize: '12px !important' }} />}
          sx={{
            bgcolor: '#fff',
            color: '#e65100',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 11.5,
            borderRadius: '6px',
            px: 1.5,
            py: 0.3,
            minHeight: 24,
            fontFamily: '"DM Sans", sans-serif',
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          }}
        >
          Register now
        </Button>

        {/* Close */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.8)', width: 24, height: 24,
            '&:hover': { color: '#fff', bgcolor: 'rgba(0,0,0,0.1)' },
          }}
        >
          <Close sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* ════════════════════════════════════════════
          FLOATING HEADER — LEFT BAR
          Logo · Board Name · Actions
         ════════════════════════════════════════════ */}
      <Box
        sx={{
          ...floatingBar,
          position: 'fixed',
          top: 48,        /* below announcement bar (36) + 12px gap */
          left: 12,
          zIndex: 1100,
          gap: 0.25,
          px: 1.5
        }}
      >

        {/* Logo */}
        <Typography sx={{
          fontWeight: 900,
          fontSize: 25,
          color: '#050038',
          letterSpacing: '-0.03em',
          fontFamily: '"DM Sans", sans-serif',
          mr: 0.5,
          ml: 0.25,
          userSelect: 'none',
        }}>
          Rivo
        </Typography>

        {/* Separator dot */}

        {/* Board color chip */}
        <Box sx={{
          width: 16, height: 16, borderRadius: '4px',
          bgcolor: '#4262ff',
          flexShrink: 0,
        }} />

        {/* Board name */}
        <Typography sx={{
          fontWeight: 600,
          fontSize: 14,
          color: '#050038',
          ml: 0.5,
          userSelect: 'none',
          fontFamily: '"DM Sans", sans-serif',
        }}>
          My First Board
        </Typography>

        {/* Three dots */}
        <IconButton size="small" sx={{ ml: 1, color: '#696880', width: 28, height: 28, borderRadius: '6px', '&:hover': { bgcolor: '#f0f0f0' } }}>
          <MoreHoriz sx={{ fontSize: 18 }} />
        </IconButton>

        {/* Export / Share icon */}
        <IconButton size="small" sx={{ color: '#696880', width: 28, height: 28, borderRadius: '6px', '&:hover': { bgcolor: '#f0f0f0' } }}>
          <IosShare sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* ════════════════════════════════════════════
          FLOATING HEADER — RIGHT BAR
          Miro-exact: Collab · BG · Clear · Settings │ Avatar ▾ │ ▶ Present · ↓ Share
         ════════════════════════════════════════════ */}
      <Box
        sx={{
          ...floatingBar,
          position: 'fixed',
          top: 48,
          right: 12,
          zIndex: 1100,
          gap: 0,
          px: 1,
        }}
      >
        {/* ── Group 1: Utility icons ── */}

        {/* Collaboration */}
        <Tooltip title="Collaborators" arrow>
          <IconButton
            size="small"
            sx={{
              width: 36, height: 36, borderRadius: '6px',
              color: '#050038',
              '&:hover': { bgcolor: '#f0f0f5' },
            }}
          >
            <PeopleOutline sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Background color — Miro uses a small color chip */}
        <Tooltip title="Background" arrow>
          <Box sx={{
            width: 22, height: 22, borderRadius: '4px',
            border: '2px solid #d8d8de',
            overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
            mx: 0.5,
            transition: 'border-color 0.15s ease',
            '&:hover': { borderColor: '#4262ff' },
          }}>
            <input type="color" value={backgroundColor} onChange={handleBackgroundChange}
              style={{ width: '150%', height: '150%', marginTop: '-25%', marginLeft: '-25%', cursor: 'pointer', border: 'none' }} />
          </Box>
        </Tooltip>

        {/* Clear canvas */}
        <Tooltip title="Clear canvas" arrow>
          <IconButton
            size="small"
            onClick={handleClear}
            sx={{
              width: 36, height: 36, borderRadius: '6px',
              color: '#050038',
              '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' },
            }}
          >
            <DeleteOutline sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Export settings */}
        <Tooltip title="Export settings" arrow>
          <IconButton
            size="small"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{
              width: 36, height: 36, borderRadius: '6px',
              color: '#050038',
              '&:hover': { bgcolor: '#f0f0f5' },
            }}
          >
            <TuneOutlined sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* ── Separator ── */}
        <Box sx={{ width: '1px', height: 24, bgcolor: '#e0e0e6', mx: 0.75, flexShrink: 0 }} />

        {/* ── Group 2: Avatar + dropdown ── */}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 0,
            cursor: 'pointer', borderRadius: '20px',
            pr: 0.25, pl: 0.25,
            transition: 'background 0.15s ease',
            '&:hover': { bgcolor: '#f0f0f5' },
            '&:hover .avatar-chevron': { color: '#050038' },
          }}
        >
          <Box sx={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4262ff 0%, #7b2cbf 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 2px #fff, 0 0 0 3px rgba(66,98,255,0.4)',
            flexShrink: 0,
          }}>
            <Typography sx={{
              color: '#fff', fontSize: 11, fontWeight: 800,
              lineHeight: 1, fontFamily: '"DM Sans", sans-serif',
              userSelect: 'none',
            }}>R</Typography>
          </Box>
          <KeyboardArrowDown
            className="avatar-chevron"
            sx={{ fontSize: 16, color: '#9795b5', ml: -0.25, transition: 'color 0.15s ease' }}
          />
        </Box>

        {/* ── Separator ── */}
        <Box sx={{ width: '1px', height: 24, bgcolor: '#e0e0e6', mx: 0.5, flexShrink: 0 }} />

        {/* ── Group 3: Present + Share ── */}

        {/* Present — Miro outlined button */}
        <Button
          size="small"
          startIcon={<PlayArrow sx={{ fontSize: '15px !important', ml: 0.25 }} />}
          sx={{
            textTransform: 'none',
            color: '#050038',
            fontWeight: 600,
            fontSize: 13.5,
            borderRadius: '6px',
            px: 1.5,
            ml: 0.25,
            minHeight: 34,
            minWidth: 'auto',
            border: 'none',
            fontFamily: '"DM Sans", sans-serif',
            letterSpacing: '-0.01em',
            '&:hover': { bgcolor: '#f0f0f5' },
          }}
        >
          Present
        </Button>

        {/* Share / Export — Miro blue CTA */}
        <Button
          onClick={() => handleExport()}
          size="small"
          variant="contained"
          disableElevation
          startIcon={<FileDownloadOutlined sx={{ fontSize: '16px !important' }} />}
          sx={{
            bgcolor: '#4262ff',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 13.5,
            borderRadius: '6px',
            px: 2,
            ml: 0.25,
            minHeight: 34,
            minWidth: 'auto',
            fontFamily: '"DM Sans", sans-serif',
            letterSpacing: '-0.01em',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#3451d1', boxShadow: 'none' },
          }}
        >
          Share
        </Button>
      </Box>

      {/* ════════════════════════════════════════════
          FLOATING CONTEXT TOOLBAR
          Appears above selected objects — Miro-style
         ════════════════════════════════════════════ */}


      {/* ===== EXPORT SETTINGS MENU ===== */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            background: '#ffffff',
            width: 260,
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            mt: 1,
            overflow: 'hidden',
            p: 0,
          }
        }}
      >
        {/* Quality */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ color: '#696880', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: '"DM Sans", sans-serif' }}>
              Export Quality
            </Typography>
            <Typography sx={{ color: '#050038', fontWeight: 700, fontSize: 13, bgcolor: '#f5f5f5', px: 1, py: 0.25, borderRadius: '4px', fontFamily: '"DM Sans", sans-serif' }}>
              {Math.round(exportQuality * 100)}%
            </Typography>
          </Box>
          <Slider
            value={exportQuality}
            onChange={(e, val) => setExportQuality(val)}
            min={0.1} max={1} step={0.1}
            sx={{
              color: '#4262ff', height: 4,
              '& .MuiSlider-thumb': { width: 14, height: 14, bgcolor: '#fff', border: '2px solid #4262ff' },
              '& .MuiSlider-track': { border: 'none' },
              '& .MuiSlider-rail': { opacity: 0.2 },
            }}
          />
        </Box>
        <Divider sx={{ borderColor: '#f0f0f0' }} />
        <Box sx={{ py: 1, px: 1 }}>
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
                cursor: 'pointer', px: 1.5, py: 1, borderRadius: '8px',
                transition: 'all 0.12s ease',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              <Typography sx={{ fontWeight: 600, color: '#050038', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>{item.label}</Typography>
              <Typography sx={{ color: '#9795b5', fontSize: 11, fontFamily: '"DM Sans", sans-serif' }}>{item.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Menu>
    </>
  );
};

export default TopBar;



// {selectedObject && (
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 108,
//             left: '50%',
//             transform: 'translateX(-50%)',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 0,
//             background: '#ffffff',
//             borderRadius: '10px',
//             boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
//             height: 40,
//             px: 0.5,
//             zIndex: 1150,
//             animation: 'floatIn 0.2s ease-out',
//             '@keyframes floatIn': {
//               '0%': { opacity: 0, transform: 'translateX(-50%) translateY(6px)' },
//               '100%': { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
//             },
//           }}
//         >
//           {/* Object type badge */}
//           <Box sx={{
//             display: 'flex', alignItems: 'center', gap: 0.5,
//             px: 1.25, height: '100%',
//             borderRight: '1px solid #f0f0f0',
//           }}>
//             <Box sx={{
//               width: 20, height: 20, borderRadius: '4px',
//               bgcolor: '#f0f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
//             }}>
//               <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#4262ff', fontFamily: '"DM Sans", sans-serif' }}>
//                 {isText ? 'T' : selectedObject?.type === 'image' ? '◻' : '■'}
//               </Typography>
//             </Box>
//           </Box>

//           {/* ─ Text-specific formatting ─ */}
//           {isText && (
//             <>
//               {/* Font family */}
//               <Box sx={{
//                 display: 'flex', alignItems: 'center', gap: 0.5,
//                 px: 1, height: '100%',
//                 borderRight: '1px solid #f0f0f0',
//                 cursor: 'pointer',
//                 '&:hover': { bgcolor: '#f8f8f8' },
//               }}>
//                 <Typography sx={{
//                   fontSize: 12.5, fontWeight: 600, color: '#050038',
//                   fontFamily: '"DM Sans", sans-serif',
//                   maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
//                 }}>
//                   {selectedObject?.fontFamily || 'Noto Sans'}
//                 </Typography>
//               </Box>

//               {/* Font size */}
//               <Box sx={{
//                 display: 'flex', alignItems: 'center', gap: 0.25,
//                 px: 0.75, height: '100%',
//                 borderRight: '1px solid #f0f0f0',
//               }}>
//                 <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#050038', fontFamily: '"DM Sans", sans-serif', minWidth: 18, textAlign: 'center' }}>
//                   {selectedObject?.fontSize || 14}
//                 </Typography>
//               </Box>

//               {/* Bold */}
//               <Tooltip title="Bold" arrow>
//                 <IconButton size="small" onClick={toggleBold}
//                   sx={{
//                     width: 32, height: 32, borderRadius: '6px',
//                     color: selectedObject?.fontWeight === 'bold' ? '#4262ff' : '#050038',
//                     '&:hover': { bgcolor: '#f0f0f0' },
//                   }}>
//                   <FormatBold sx={{ fontSize: 18 }} />
//                 </IconButton>
//               </Tooltip>

//               {/* Italic — removed extra border separators for tighter look */}

//               {/* Alignment */}
//               <Tooltip title="Align Left" arrow>
//                 <IconButton size="small" onClick={() => setAlign('left')}
//                   sx={{
//                     width: 32, height: 32, borderRadius: '6px',
//                     color: selectedObject?.textAlign === 'left' ? '#4262ff' : '#696880',
//                     '&:hover': { bgcolor: '#f0f0f0' },
//                   }}>
//                   <FormatAlignLeft sx={{ fontSize: 17 }} />
//                 </IconButton>
//               </Tooltip>

//               <Tooltip title="Align Center" arrow>
//                 <IconButton size="small" onClick={() => setAlign('center')}
//                   sx={{
//                     width: 32, height: 32, borderRadius: '6px',
//                     color: selectedObject?.textAlign === 'center' ? '#4262ff' : '#696880',
//                     '&:hover': { bgcolor: '#f0f0f0' },
//                   }}>
//                   <FormatAlignCenter sx={{ fontSize: 17 }} />
//                 </IconButton>
//               </Tooltip>

//               {/* List */}
//               <Tooltip title="List" arrow>
//                 <IconButton size="small"
//                   sx={{
//                     width: 32, height: 32, borderRadius: '6px',
//                     color: '#696880',
//                     '&:hover': { bgcolor: '#f0f0f0' },
//                   }}>
//                   <FormatListBulleted sx={{ fontSize: 17 }} />
//                 </IconButton>
//               </Tooltip>

//               {/* Separator */}
//               <Box sx={{ width: 1, height: 20, bgcolor: '#e6e6e6', mx: 0.25 }} />

//               {/* Link */}
//               <Tooltip title="Link" arrow>
//                 <IconButton size="small"
//                   sx={{
//                     width: 32, height: 32, borderRadius: '6px',
//                     color: '#696880',
//                     '&:hover': { bgcolor: '#f0f0f0' },
//                   }}>
//                   <LinkOutlined sx={{ fontSize: 17 }} />
//                 </IconButton>
//               </Tooltip>

//               {/* Text color */}
//               <Tooltip title="Text Color" arrow>
//                 <IconButton size="small"
//                   sx={{
//                     width: 32, height: 32, borderRadius: '6px',
//                     color: '#696880',
//                     '&:hover': { bgcolor: '#f0f0f0' },
//                   }}>
//                   <FormatColorText sx={{ fontSize: 17 }} />
//                 </IconButton>
//               </Tooltip>
//             </>
//           )}

//           {/* ─ Universal actions ─ */}
//           <Box sx={{ width: 1, height: 20, bgcolor: '#e6e6e6', mx: 0.25 }} />

//           {/* Fill color */}
//           <Tooltip title="Fill Color" arrow>
//             <IconButton size="small"
//               sx={{
//                 width: 32, height: 32, borderRadius: '6px',
//                 color: '#696880',
//                 '&:hover': { bgcolor: '#f0f0f0' },
//               }}>
//               <FormatColorFill sx={{ fontSize: 17 }} />
//             </IconButton>
//           </Tooltip>

//           {/* Emoji */}
//           <Tooltip title="Emoji" arrow>
//             <IconButton size="small"
//               sx={{
//                 width: 32, height: 32, borderRadius: '6px',
//                 color: '#696880',
//                 '&:hover': { bgcolor: '#f0f0f0' },
//               }}>
//               <EmojiEmotionsOutlined sx={{ fontSize: 17 }} />
//             </IconButton>
//           </Tooltip>

//           {/* Lock */}
//           <Tooltip title="Lock" arrow>
//             <IconButton size="small"
//               sx={{
//                 width: 32, height: 32, borderRadius: '6px',
//                 color: '#696880',
//                 '&:hover': { bgcolor: '#f0f0f0' },
//               }}>
//               <LockOutlined sx={{ fontSize: 17 }} />
//             </IconButton>
//           </Tooltip>

//           {/* Duplicate */}
//           <Tooltip title="Duplicate" arrow>
//             <IconButton size="small" onClick={() => duplicateSelected(canvas)}
//               sx={{
//                 width: 32, height: 32, borderRadius: '6px',
//                 color: '#696880',
//                 '&:hover': { bgcolor: '#f0f0f0' },
//               }}>
//               <ContentCopy sx={{ fontSize: 16 }} />
//             </IconButton>
//           </Tooltip>

//           {/* Delete */}
//           <Tooltip title="Delete" arrow>
//             <IconButton size="small" onClick={() => deleteSelected(canvas)}
//               sx={{
//                 width: 32, height: 32, borderRadius: '6px',
//                 color: '#696880',
//                 '&:hover': { bgcolor: '#fef2f2', color: '#dc2626' },
//               }}>
//               <DeleteOutline sx={{ fontSize: 17 }} />
//             </IconButton>
//           </Tooltip>

//           {/* More */}
//           <Tooltip title="More options" arrow>
//             <IconButton size="small"
//               sx={{
//                 width: 32, height: 32, borderRadius: '6px',
//                 color: '#696880',
//                 bgcolor: '#f0f0ff',
//                 '&:hover': { bgcolor: '#e8e8ff' },
//               }}>
//               <MoreVert sx={{ fontSize: 17 }} />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       )}


