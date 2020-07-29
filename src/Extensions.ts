// A few extension methods for the Math class, didnt even end up using lerp
interface Math {
    lerp: (from: number, to: number, value: number) => number
    clamp: (value: number, min: number, max: number) => number
}
Math.lerp = (from, to, amount) => {
    return (1 - amount) * from + amount * to;
}
Math.clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
}
