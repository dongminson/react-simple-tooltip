import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

interface TooltipProps {
  active: boolean;
  parent: HTMLElement;
  children: ReactNode;
  offset?: number;
  position?: 'top' | 'left' | 'bottom' | 'right';
  tipStyle?: React.CSSProperties;
  timeout?: number;
  className?: string;
}

interface CoreProps {
  active: boolean;
  parent: HTMLElement;
  offset?: number;
  position?: 'top' | 'left' | 'bottom' | 'right';
  tipStyle?: React.CSSProperties;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
  className?: string;
  children: ReactNode;
}

const TOP = 'top' as const;
const LEFT = 'left' as const;
const BOTTOM = 'bottom' as const;
const RIGHT = 'right' as const;

const Tooltip: React.FC<TooltipProps> = ({
  active,
  parent,
  children,
  offset = 10,
  position = 'left',
  tipStyle = {},
  timeout = 750,
  className,
}) => {
  const [hover, setHover] = useState(false);
  const [show, setShow] = useState(active);

  const timeoutRef = useRef<number | undefined>();

  const onMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setHover(true);
  };

  const onMouseLeave = () => {
    setHover(false);
    setHoverTimeout();
  };

  const setHoverTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      if (!hover) {
        setShow(false);
      }
    }, timeout);
  };

  useEffect(() => {
    if (active && !show) {
      setShow(true);
    }

    if (!active && !hover) {
      setHoverTimeout();
    }
  }, [active, hover, show]);

  if ((!active && !show && !hover) || !parent || !active) return null;

  return createPortal(
    <Core
      active={active || hover}
      parent={parent}
      offset={offset}
      position={position}
      tipStyle={tipStyle}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Core>,
    document.body,
  );
};

const Core: React.FC<CoreProps> = ({
  parent,
  offset = 10,
  position = 'left',
  tipStyle = {},
  onMouseLeave,
  onMouseEnter,
  className,
  children,
}) => {
  const [positionState, setPosition] = useState({ top: 0, left: 0 });
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTipPosition();
  }, [parent]);

  const getTipPosition = () => {
    if (!tipRef.current || !parent) return;

    const scrollY =
      window.scrollY !== undefined ? window.scrollY : window.pageYOffset;
    const scrollX =
      window.scrollX !== undefined ? window.scrollX : window.pageXOffset;

    const pNode = parent.getBoundingClientRect();
    const tipNode = tipRef.current.getBoundingClientRect();

    let top;
    let left;

    switch (position) {
      case TOP:
        top = scrollY + pNode.top - tipNode.height - offset;
        left = scrollX + pNode.left + pNode.width / 2 - tipNode.width / 2;
        break;

      case LEFT:
        top = scrollY + pNode.top + pNode.height / 2 - offset;
        left = scrollX + pNode.left - offset - tipNode.width;
        break;

      case BOTTOM:
        top = scrollY + pNode.top + pNode.height + offset;
        left = scrollX + pNode.left + pNode.width / 2 - tipNode.width / 2;
        break;

      case RIGHT:
        top = scrollY + pNode.top + pNode.height / 2 - offset;
        left = scrollX + pNode.left + pNode.width + offset;
        break;

      default:
    }

    if (top && left) {
      setPosition({ top, left });
    }
  };

  return (
    <div
      ref={tipRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        zIndex: 1000,
        ...positionState,
        ...tipStyle,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

Tooltip.propTypes = {
  active: PropTypes.bool.isRequired,
  parent: PropTypes.instanceOf(HTMLElement).isRequired,
  children: PropTypes.node.isRequired,
  offset: PropTypes.number,
  position: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
  tipStyle: PropTypes.object,
  timeout: PropTypes.number,
  className: PropTypes.string,
};

Tooltip.defaultProps = {
  active: false,
  offset: 10,
  position: 'left',
  tipStyle: {},
  timeout: 750,
};

export default Tooltip;
