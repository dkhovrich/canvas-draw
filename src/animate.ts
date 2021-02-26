type Animate = (props: AnimateProps) => void;

type AnimateProps = {
    duration: number;
    timing: (timeFraction: number) => number;
    draw: (progress: number) => void;
};

export const animate: Animate = ({ timing, draw, duration }) => {
    const start = performance.now();

    requestAnimationFrame(function animate(time) {
        const timeFraction = Math.min((time - start) / duration, 1);
        const progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
};
