import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Grid,
    IconButton,
    Tooltip,
    Fade,
    Paper,
    CircularProgress
} from '@mui/material';
import {
    Search,
    Close,
    Category,
    EmojiEmotions,
    Interests,
    Image as ImageIcon,
    Business
} from '@mui/icons-material';
import useStore from './store/useStore';
import { ASSET_REGISTRY, ASSET_TYPES, searchAssets } from './utils/assetRegistry';
import { addAsset, addImageToCanvas } from './utils/canvasUtils';

const UNSPLASH_ACCESS_KEY = 'IKEJksWISBaVwk7gPFe6V4lMRkgFfD4MPINUQyYmHvo';

const AssetPanel = () => {
    const { canvas, isAssetPanelOpen, setAssetPanelOpen } = useStore();
    const [activeTab, setActiveTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    // Unsplash State
    const [unsplashImages, setUnsplashImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);

    const handleClose = () => setAssetPanelOpen(false);

    const handleAssetClick = (asset) => {
        addAsset(canvas, asset);
    };

    const handleImageClick = (imageUrl) => {
        addImageToCanvas(canvas, imageUrl);
    };

    const tabs = [
        { label: 'Icons', type: ASSET_TYPES.ICONS, icon: <Interests sx={{ fontSize: 18 }} /> },
        { label: 'Shapes', type: ASSET_TYPES.SHAPES, icon: <Category sx={{ fontSize: 18 }} /> },
        { label: 'Emojis', type: ASSET_TYPES.EMOJIS, icon: <EmojiEmotions sx={{ fontSize: 18 }} /> },
        { label: 'Images', type: 'images', icon: <ImageIcon sx={{ fontSize: 18 }} /> },
    ];

    // Fetch Unsplash Images
    useEffect(() => {
        const isImagesTab = tabs[activeTab].type === 'images';

        if (isImagesTab) {
            const fetchImages = async () => {
                setLoadingImages(true);
                try {
                    const endpoint = searchQuery
                        ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=20`
                        : `https://api.unsplash.com/photos?per_page=20&order_by=popular`;

                    const res = await fetch(endpoint, {
                        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setUnsplashImages(searchQuery ? data.results : data);
                    } else {
                        console.error("Unsplash error:", await res.text());
                    }
                } catch (error) {
                    console.error("Error fetching from Unsplash:", error);
                } finally {
                    setLoadingImages(false);
                }
            };

            // Debounce search
            const timeoutId = setTimeout(() => {
                fetchImages();
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [activeTab, searchQuery]);

    // Filter Local Assets
    const filteredAssets = useMemo(() => {
        const currentType = tabs[activeTab].type;
        if (currentType === 'images') return []; // Handled by Unsplash state

        // Strict filtering: First filter by type, then by search query
        let assets = ASSET_REGISTRY.filter(asset => asset.type === currentType);

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            assets = assets.filter(asset =>
                asset.name.toLowerCase().includes(lowerQuery) ||
                asset.category.toLowerCase().includes(lowerQuery)
            );
        }
        return assets;
    }, [activeTab, searchQuery]);

    if (!isAssetPanelOpen) return null;

    const isImagesTab = tabs[activeTab].type === 'images';

    return (
        <Fade in={isAssetPanelOpen} timeout={200}>
            <Paper
                elevation={0}
                sx={{
                    position: 'fixed',
                    left: 72,       /* right next to the 52px floating toolbar + 20px gap */
                    top: 108,       /* below announcement(36) + gap(12) + header(48) + gap(12) */
                    bottom: 12,
                    width: 320,
                    bgcolor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)',
                    zIndex: 999,
                    display: isAssetPanelOpen ? 'flex' : 'none',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#050038', fontSize: 15 }}>
                        Assets
                    </Typography>
                    <IconButton size="small" onClick={handleClose} sx={{ color: '#696880', '&:hover': { color: '#050038', bgcolor: '#f5f5f5' } }}>
                        <Close fontSize="small" />
                    </IconButton>
                </Box>

                {/* Search */}
                <Box sx={{ px: 2, py: 1.5 }}>
                    <TextField
                        fullWidth
                        placeholder={isImagesTab ? "Search photos..." : "Search assets..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#9795b5', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: '8px',
                                bgcolor: '#f5f5f5',
                                fontSize: 13,
                                '& fieldset': { border: 'none' },
                                '&:hover': { bgcolor: '#ebebeb' },
                                '&.Mui-focused': { bgcolor: '#ffffff', boxShadow: '0 0 0 2px #4262ff' }
                            }
                        }}
                    />
                </Box>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={(e, v) => setActiveTab(v)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        minHeight: 40,
                        px: 2,
                        borderBottom: '1px solid #f0f0f0',
                        '& .MuiTab-root': {
                            minHeight: 40,
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'none',
                            color: '#696880',
                            minWidth: 'auto',
                            mr: 1,
                            '&.Mui-selected': { color: '#4262ff' }
                        },
                        '& .MuiTabs-indicator': { bgcolor: '#4262ff', height: 2, borderRadius: 1 }
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.label} label={tab.label} icon={tab.icon} iconPosition="start" />
                    ))}
                </Tabs>

                {/* Content Grid */}
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                    {isImagesTab ? (
                        // Unsplash Images Grid
                        loadingImages ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress size={24} sx={{ color: '#4262ff' }} />
                            </Box>
                        ) : unsplashImages.length === 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9795b5' }}>
                                <ImageIcon sx={{ fontSize: 40, mb: 1, opacity: 0.2 }} />
                                <Typography variant="body2">No images found</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={1.5}>
                                {unsplashImages.map((img) => (
                                    <Grid item xs={6} key={img.id}>
                                        <Tooltip title={`Photo by ${img.user.name}`} arrow placement="top">
                                            <Box
                                                onClick={() => handleImageClick(img.urls.regular)}
                                                sx={{
                                                    aspectRatio: '1/1',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    bgcolor: '#f5f5f5',
                                                    transition: 'all 0.15s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.02)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                    }
                                                }}
                                            >
                                                <img
                                                    src={img.urls.small}
                                                    alt={img.alt_description}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <Box sx={{
                                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                                    p: 0.5, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                                    color: 'white', fontSize: 10, opacity: 0, transition: 'opacity 0.2s',
                                                    display: 'flex', justifyContent: 'center'
                                                }} className="credit">
                                                    {img.user.first_name}
                                                </Box>
                                            </Box>
                                        </Tooltip>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    ) : (
                        // Local Assets Grid
                        filteredAssets.length === 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9795b5' }}>
                                <Search sx={{ fontSize: 40, mb: 1, opacity: 0.2 }} />
                                <Typography variant="body2">No assets found</Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={1.5}>
                                {filteredAssets.map((asset) => (
                                    <Grid item xs={4} key={asset.id}>
                                        <Tooltip title={asset.name} arrow placement="top">
                                            <Box
                                                onClick={() => handleAssetClick(asset)}
                                                sx={{
                                                    aspectRatio: '1/1',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: '#f8f8f8',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    border: '1px solid transparent',
                                                    color: '#3f3f46',
                                                    '&:hover': {
                                                        bgcolor: '#ffffff',
                                                        borderColor: '#e6e6e6',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                                        transform: 'translateY(-2px)',
                                                        color: '#050038'
                                                    }
                                                }}
                                            >
                                                {asset.type === ASSET_TYPES.EMOJIS ? (
                                                    <Typography sx={{ fontSize: 32 }}>{asset.icon}</Typography>
                                                ) : (
                                                    React.cloneElement(asset.icon, { sx: { fontSize: 28 } })
                                                )}
                                                <Typography variant="caption" sx={{ mt: 0.5, fontSize: 10, fontWeight: 500, maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'inherit', opacity: 0.7 }}>
                                                    {asset.name}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    )}
                </Box>
            </Paper>
        </Fade >
    );
};

export default AssetPanel;
