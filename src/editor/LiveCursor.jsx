import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

const FOLLOW_EASING = 0.2;

const CursorSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 14 14">
    <path
      fill="#1e9b1b"
      fillRule="evenodd"
      d="M1.972.08H1.97A1.49 1.49 0 0 0 .08 1.97l.473-.162l-.473.163l.001.002l.002.006l.008.024l.032.092l.12.35L.675 3.7l3.07 8.944l.128.373l.035.104l.01.03a.995.995 0 0 0 1.73.56a1 1 0 0 0 .193-.26c.045-.088.078-.187.11-.279l.001-.004l.995-2.87l.65-1.876l.213-.613l.002-.005l.007-.002l.617-.218l1.885-.667a323 323 0 0 0 2.878-1.027l.046-.018c.11-.043.307-.118.465-.276a.994.994 0 0 0 0-1.406l-.01-.01a1.3 1.3 0 0 0-.182-.164a1.2 1.2 0 0 0-.373-.169h-.002l-.035-.012L13 3.8l-.382-.127l-1.298-.436A5548 5548 0 0 1 3.687.66L2.441.24L2.093.12L2 .091l-.023-.01z"
      clipRule="evenodd"
    />
  </svg>
);

const LiveCursor = ({
  label = 'Rajan',
  chipColor = '#f7b5b4',
  textColor = '#7a2e3b',
}) => {
  const cursorRef = useRef(null);
  const frameRef = useRef(0);
  const visibleRef = useRef(false);
  const currentRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const syncPointerMode = () => setIsFinePointer(mediaQuery.matches);

    syncPointerMode();
    mediaQuery.addEventListener('change', syncPointerMode);

    return () => mediaQuery.removeEventListener('change', syncPointerMode);
  }, []);

  useEffect(() => {
    if (!isFinePointer) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      visibleRef.current = false;
      setIsVisible(false);
      return undefined;
    }

    const updateCursor = () => {
      const cursorNode = cursorRef.current;
      const current = currentRef.current;
      const target = targetRef.current;

      current.x += (target.x - current.x) * FOLLOW_EASING;
      current.y += (target.y - current.y) * FOLLOW_EASING;

      if (cursorNode) {
        cursorNode.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
        cursorNode.style.opacity = visibleRef.current ? '1' : '0';
      }

      frameRef.current = window.requestAnimationFrame(updateCursor);
    };

    const handlePointerMove = (event) => {
      const nextX = event.clientX;
      const nextY = event.clientY;

      targetRef.current.x = nextX;
      targetRef.current.y = nextY;

      if (!visibleRef.current) {
        currentRef.current.x = nextX;
        currentRef.current.y = nextY;
      }

      visibleRef.current = true;
      setIsVisible(true);
    };

    const handlePointerLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);
    frameRef.current = window.requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <Box
      ref={cursorRef}
      aria-hidden="true"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2000,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        willChange: 'transform, opacity',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 92,
          height: 92,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: -20,
            top: -14,
            width: 74,
            height: 74,
            transform: 'rotate(-14deg)',
            transformOrigin: 'top left',
            filter: 'drop-shadow(0 10px 18px rgba(30, 155, 27, 0.18))',
          }}
        >
          <CursorSvg />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'inline-flex',
            alignItems: 'center',
            minWidth: 74,
            px: 1.5,
            py: 0.75,
            borderRadius: '4px',
            bgcolor: chipColor,
            border: '1.5px solid rgba(93, 34, 45, 0.4)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography
            sx={{
              color: textColor,
              fontSize: 15,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveCursor;
