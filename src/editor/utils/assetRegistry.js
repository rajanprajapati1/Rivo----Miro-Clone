import {
    Star,
    Favorite,
    Hexagon,
    Pentagon,
    Square,
    Circle,
    ChangeHistory,
    ArrowForward,
    ChatBubble,
    Bolt,
    Spa,
    Pets,
    AcUnit,
    AccessTime,
    AttachFile,
    Cloud,
    ContentCut,
    Delete,
    Edit,
    Flag,
    Home,
    Image,
    Link,
    Lock,
    Mail,
    Map,
    Menu,
    Mic,
    MoreHoriz,
    Notifications,
    Person,
    PlayArrow,
    Print,
    Save,
    Search,
    Settings,
    Share,
    ShoppingCart,
    ThumbUp,
    Visibility,
    Warning,
    Wifi,
    Work
} from '@mui/icons-material';

// Asset Types
export const ASSET_TYPES = {
    ICONS: 'icons',
    SHAPES: 'shapes',
    EMOJIS: 'emojis',
    ILLUSTRATIONS: 'illustrations',
    LOGOS: 'logos'
};

// Mock Data Registry
export const ASSET_REGISTRY = [
    // --- SHAPES ---
    {
        id: 'shape-rect',
        type: ASSET_TYPES.SHAPES,
        name: 'Rectangle',
        category: 'Basic',
        icon: <Square />,
        data: { type: 'rect', width: 100, height: 100, fill: '#18181b' }
    },
    {
        id: 'shape-circle',
        type: ASSET_TYPES.SHAPES,
        name: 'Circle',
        category: 'Basic',
        icon: <Circle />,
        data: { type: 'circle', radius: 50, fill: '#18181b' }
    },
    {
        id: 'shape-triangle',
        type: ASSET_TYPES.SHAPES,
        name: 'Triangle',
        category: 'Basic',
        icon: <ChangeHistory />,
        data: { type: 'triangle', width: 100, height: 100, fill: '#18181b' }
    },
    {
        id: 'shape-star',
        type: ASSET_TYPES.SHAPES,
        name: 'Star',
        category: 'Basic',
        icon: <Star />,
        data: { type: 'path', path: 'M 0 -50 L 11 -15 L 47 -15 L 18 6 L 29 41 L 0 20 L -29 41 L -18 6 L -47 -15 L -11 -15 Z', fill: '#18181b' }
    },
    {
        id: 'shape-heart',
        type: ASSET_TYPES.SHAPES,
        name: 'Heart',
        category: 'Basic',
        icon: <Favorite />,
        data: { type: 'path', path: 'M 0 -30 C -20 -50 -50 -20 0 20 C 50 -20 20 -50 0 -30 Z', fill: '#ef4444' }
    },
    {
        id: 'shape-hexagon',
        type: ASSET_TYPES.SHAPES,
        name: 'Hexagon',
        category: 'Polygon',
        icon: <Hexagon />,
        data: { type: 'polygon', sides: 6, radius: 50, fill: '#18181b' }
    },
    {
        id: 'shape-pentagon',
        type: ASSET_TYPES.SHAPES,
        name: 'Pentagon',
        category: 'Polygon',
        icon: <Pentagon />,
        data: { type: 'polygon', sides: 5, radius: 50, fill: '#18181b' }
    },
    {
        id: 'shape-arrow',
        type: ASSET_TYPES.SHAPES,
        name: 'Arrow',
        category: 'Arrows',
        icon: <ArrowForward />,
        data: { type: 'path', path: 'M -40 -10 L 10 -10 L 10 -30 L 50 0 L 10 30 L 10 10 L -40 10 Z', fill: '#18181b' }
    },
    {
        id: 'shape-bubble',
        type: ASSET_TYPES.SHAPES,
        name: 'Speech Bubble',
        category: 'Communication',
        icon: <ChatBubble />,
        data: { type: 'path', path: 'M -40 -30 L 40 -30 L 40 10 L 10 10 L 0 30 L -10 10 L -40 10 Z', fill: '#18181b' }
    },

    // --- ICONS ---
    {
        id: 'icon-home',
        type: ASSET_TYPES.ICONS,
        name: 'Home',
        category: 'General',
        icon: <Home />,
        data: { type: 'path', path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', fill: '#18181b' }
    },
    {
        id: 'icon-search',
        type: ASSET_TYPES.ICONS,
        name: 'Search',
        category: 'General',
        icon: <Search />,
        data: { type: 'path', path: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z', fill: '#18181b' }
    },
    {
        id: 'icon-settings',
        type: ASSET_TYPES.ICONS,
        name: 'Settings',
        category: 'General',
        icon: <Settings />,
        data: { type: 'path', path: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z', fill: '#18181b' }
    },
    {
        id: 'icon-user',
        type: ASSET_TYPES.ICONS,
        name: 'User',
        category: 'General',
        icon: <Person />,
        data: { type: 'path', path: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', fill: '#18181b' }
    },
    {
        id: 'icon-mail',
        type: ASSET_TYPES.ICONS,
        name: 'Mail',
        category: 'Communication',
        icon: <Mail />,
        data: { type: 'path', path: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z', fill: '#18181b' }
    },
    {
        id: 'icon-star',
        type: ASSET_TYPES.ICONS,
        name: 'Star',
        category: 'General',
        icon: <Star />,
        data: { type: 'path', path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z', fill: '#18181b' }
    },
    {
        id: 'icon-heart',
        type: ASSET_TYPES.ICONS,
        name: 'Heart',
        category: 'General',
        icon: <Favorite />,
        data: { type: 'path', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', fill: '#18181b' }
    },
    {
        id: 'icon-share',
        type: ASSET_TYPES.ICONS,
        name: 'Share',
        category: 'Communication',
        icon: <Share />,
        data: { type: 'path', path: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z', fill: '#18181b' }
    },
    {
        id: 'icon-trash',
        type: ASSET_TYPES.ICONS,
        name: 'Delete',
        category: 'General',
        icon: <Delete />,
        data: { type: 'path', path: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z', fill: '#18181b' }
    },
    {
        id: 'icon-edit',
        type: ASSET_TYPES.ICONS,
        name: 'Edit',
        category: 'General',
        icon: <Edit />,
        data: { type: 'path', path: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z', fill: '#18181b' }
    },
    {
        id: 'icon-image',
        type: ASSET_TYPES.ICONS,
        name: 'Image',
        category: 'Media',
        icon: <Image />,
        data: { type: 'path', path: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z', fill: '#18181b' }
    },
    {
        id: 'icon-play',
        type: ASSET_TYPES.ICONS,
        name: 'Play',
        category: 'Media',
        icon: <PlayArrow />,
        data: { type: 'path', path: 'M8 5v14l11-7z', fill: '#18181b' }
    },
    {
        id: 'icon-lock',
        type: ASSET_TYPES.ICONS,
        name: 'Lock',
        category: 'Security',
        icon: <Lock />,
        data: { type: 'path', path: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z', fill: '#18181b' }
    },
    {
        id: 'icon-wifi',
        type: ASSET_TYPES.ICONS,
        name: 'Wifi',
        category: 'Tech',
        icon: <Wifi />,
        data: { type: 'path', path: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z', fill: '#18181b' }
    },
    {
        id: 'icon-cloud',
        type: ASSET_TYPES.ICONS,
        name: 'Cloud',
        category: 'Tech',
        icon: <Cloud />,
        data: { type: 'path', path: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z', fill: '#18181b' }
    },
    {
        id: 'icon-cart',
        type: ASSET_TYPES.ICONS,
        name: 'Cart',
        category: 'Commerce',
        icon: <ShoppingCart />,
        data: { type: 'path', path: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z', fill: '#18181b' }
    },

    // --- EMOJIS (Using text for now) ---
    { id: 'emoji-smile', type: ASSET_TYPES.EMOJIS, name: 'Smile', category: 'Smileys', icon: '😊' },
    { id: 'emoji-laugh', type: ASSET_TYPES.EMOJIS, name: 'Laugh', category: 'Smileys', icon: '😂' },
    { id: 'emoji-love', type: ASSET_TYPES.EMOJIS, name: 'Love', category: 'Smileys', icon: '😍' },
    { id: 'emoji-cool', type: ASSET_TYPES.EMOJIS, name: 'Cool', category: 'Smileys', icon: '😎' },
    { id: 'emoji-fire', type: ASSET_TYPES.EMOJIS, name: 'Fire', category: 'Objects', icon: '🔥' },
    { id: 'emoji-rocket', type: ASSET_TYPES.EMOJIS, name: 'Rocket', category: 'Travel', icon: '🚀' },
    { id: 'emoji-star', type: ASSET_TYPES.EMOJIS, name: 'Star', category: 'Symbols', icon: '⭐' },
    { id: 'emoji-heart', type: ASSET_TYPES.EMOJIS, name: 'Heart', category: 'Symbols', icon: '❤️' },
    { id: 'emoji-check', type: ASSET_TYPES.EMOJIS, name: 'Check', category: 'Symbols', icon: '✅' },
    { id: 'emoji-warning', type: ASSET_TYPES.EMOJIS, name: 'Warning', category: 'Symbols', icon: '⚠️' },
    { id: 'emoji-party', type: ASSET_TYPES.EMOJIS, name: 'Party', category: 'Objects', icon: '🎉' },
    { id: 'emoji-thumbsup', type: ASSET_TYPES.EMOJIS, name: 'Thumbs Up', category: 'Smileys', icon: '👍' },
    { id: 'emoji-clap', type: ASSET_TYPES.EMOJIS, name: 'Clap', category: 'Smileys', icon: '👏' },
    { id: 'emoji-eyes', type: ASSET_TYPES.EMOJIS, name: 'Eyes', category: 'Smileys', icon: '👀' },
    { id: 'emoji-100', type: ASSET_TYPES.EMOJIS, name: '100', category: 'Symbols', icon: '💯' },
];

export const getAssetsByType = (type) => ASSET_REGISTRY.filter(asset => asset.type === type);
export const searchAssets = (query) => {
    const lowerQuery = query.toLowerCase();
    return ASSET_REGISTRY.filter(asset =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.category.toLowerCase().includes(lowerQuery)
    );
};
