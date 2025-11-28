// 使用 crypto.randomUUID()（如可用）
// 否則 fallback 到 secureUUID()
export function generateUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return secureUUID();
}

// fallback：cryptographically secure UUID v4
export function secureUUID() {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);

    // UUID v4 標準
    buf[6] = (buf[6] & 0x0f) | 0x40;
    buf[8] = (buf[8] & 0x3f) | 0x80;

    return [...buf]
        .map((b, i) => {
            const hex = b.toString(16).padStart(2, "0");
            return [4, 6, 8, 10].includes(i) ? "-" + hex : hex;
        })
        .join("");
}
