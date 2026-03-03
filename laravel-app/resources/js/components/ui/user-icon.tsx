import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const UserIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".user-fill",
        { opacity: [0, 1], scale: [0.8, 1] },
        { duration: 0.4, ease: "easeOut" },
      );
      animate(
        ".user-outline",
        { scale: [1, 1.05, 1], y: [0, -1, 0] },
        { duration: 0.5, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(async () => {
      animate(
        ".user-fill",
        { opacity: [1, 0] },
        { duration: 0.3, ease: "easeOut" },
      );
      animate(
        ".user-outline",
        { scale: 1, y: 0 },
        { duration: 0.3, ease: "easeInOut" },
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
        onHoverStart={start}
        onHoverEnd={stop}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <motion.g
          className="user-fill"
          style={{ transformOrigin: "50% 50%" }}
          opacity={0}
        >
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" fill={color} />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" fill={color} />
        </motion.g>
        <motion.g
          className="user-outline"
          style={{ transformOrigin: "50% 50%" }}
        >
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </motion.g>
      </motion.svg>
    );
  },
);

UserIcon.displayName = "UserIcon";
export default UserIcon;
