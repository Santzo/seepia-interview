interface Math {
    lerp: (from: number, to: number, value: number) => number
    clamp: (value: number, min: number, max: number) => number
}
Math.lerp = (from: number, to: number, amount: number): number => {
    return (1 - amount) * from + amount * to;
}
Math.clamp = (value, min, max): number => {
    return Math.min(Math.max(value, min), max);
}
