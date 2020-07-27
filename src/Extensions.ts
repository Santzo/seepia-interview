interface Math {
    lerp: (from: number, to: number, value: number) => number
}
Math.lerp = (from: number, to: number, amount: number): number => {
    return (1 - amount) * from + amount * to;
}
