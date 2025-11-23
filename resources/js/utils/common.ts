export function hexChecking(value: any): boolean {
    const regForHex = /^#([0-9a-f]{3}){1,2}$/i;
    return regForHex.test(value);
}