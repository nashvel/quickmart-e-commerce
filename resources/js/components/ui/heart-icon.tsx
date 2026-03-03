import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const HeartIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".heart-fill",
        { opacity: [0, 1], scale: [0.8, 1] },
        { duration: 0.4, ease: "easeOut" },
      );
      animate(
        ".heart-outline",
        { scale: [1, 1.15, 1] },
        { duration: 0.5, ease: "easeInOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate(
        ".heart-fill",
        { opacity: [1, 0] },
        { duration: 0.3, ease: "easeOut" },
      );
      animate(
        ".heart-outline",
        { scale: 1 },
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
        onHoverStart={start}
        onHoverEnd={stop}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${className} cursor-pointer`}
        style={{ overflow: "visible" }}
      >
        <motion.path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <motion.path
          className="heart-fill"
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
          fill={color}
          opacity={0}
          style={{ transformOrigin: "50% 50%" }}
        />
        <motion.path
          className="heart-outline"
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
          style={{ transformOrigin: "50% 50%" }}
        />
      </motion.svg>
    );
  },
);

HeartIcon.displayName = "HeartIcon";

export default HeartIcon;
