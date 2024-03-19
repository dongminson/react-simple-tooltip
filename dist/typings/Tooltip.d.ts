import React, { ReactNode } from 'react';
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
declare const Tooltip: React.FC<TooltipProps>;
export default Tooltip;
