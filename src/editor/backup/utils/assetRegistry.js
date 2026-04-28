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

    // --- ICONS (Using MUI Icons as proxies for SVGs) ---
    { id: 'icon-home', type: ASSET_TYPES.ICONS, name: 'Home', category: 'General', icon: <Home /> },
    { id: 'icon-search', type: ASSET_TYPES.ICONS, name: 'Search', category: 'General', icon: <Search /> },
    { id: 'icon-settings', type: ASSET_TYPES.ICONS, name: 'Settings', category: 'General', icon: <Settings /> },
    { id: 'icon-user', type: ASSET_TYPES.ICONS, name: 'User', category: 'General', icon: <Person /> },
    { id: 'icon-mail', type: ASSET_TYPES.ICONS, name: 'Mail', category: 'Communication', icon: <Mail /> },
    { id: 'icon-bell', type: ASSET_TYPES.ICONS, name: 'Notification', category: 'General', icon: <Notifications /> },
    { id: 'icon-star', type: ASSET_TYPES.ICONS, name: 'Star', category: 'General', icon: <Star /> },
    { id: 'icon-heart', type: ASSET_TYPES.ICONS, name: 'Heart', category: 'General', icon: <Favorite /> },
    { id: 'icon-share', type: ASSET_TYPES.ICONS, name: 'Share', category: 'Communication', icon: <Share /> },
    { id: 'icon-trash', type: ASSET_TYPES.ICONS, name: 'Delete', category: 'General', icon: <Delete /> },
    { id: 'icon-edit', type: ASSET_TYPES.ICONS, name: 'Edit', category: 'General', icon: <Edit /> },
    { id: 'icon-image', type: ASSET_TYPES.ICONS, name: 'Image', category: 'Media', icon: <Image /> },
    { id: 'icon-mic', type: ASSET_TYPES.ICONS, name: 'Microphone', category: 'Media', icon: <Mic /> },
    { id: 'icon-play', type: ASSET_TYPES.ICONS, name: 'Play', category: 'Media', icon: <PlayArrow /> },
    { id: 'icon-lock', type: ASSET_TYPES.ICONS, name: 'Lock', category: 'Security', icon: <Lock /> },
    { id: 'icon-bolt', type: ASSET_TYPES.ICONS, name: 'Energy', category: 'General', icon: <Bolt /> },
    { id: 'icon-wifi', type: ASSET_TYPES.ICONS, name: 'Wifi', category: 'Tech', icon: <Wifi /> },
    { id: 'icon-cloud', type: ASSET_TYPES.ICONS, name: 'Cloud', category: 'Tech', icon: <Cloud /> },
    { id: 'icon-cart', type: ASSET_TYPES.ICONS, name: 'Cart', category: 'Commerce', icon: <ShoppingCart /> },
    { id: 'icon-work', type: ASSET_TYPES.ICONS, name: 'Work', category: 'Business', icon: <Work /> },

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
