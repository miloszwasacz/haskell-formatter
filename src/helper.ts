export function max(array: number[]): number | null {
	if (array.length === 0) return null;

	let result = array[0];
	for (const num of array) {
        if (num > result)
            result = num;
    }
	return result;
}

export function zip<T, U>(a1: T[], a2: U[]): [T, U][] {
	const result: [T, U][] = [];
	for (let i = 0; i < a1.length && i < a2.length; i++)
        result.push([a1[i], a2[i]]);
	return result;
}

export function reversedString(s: string): string {
	let result = "";
	for (let i = s.length - 1; i >= 0; i--)
        result += s[i];
	return result;
}
