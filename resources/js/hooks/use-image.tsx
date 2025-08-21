import { useMemo } from 'react';

/**
 * useImage
 *
 * @param {string|object} source - Can be:
 *    - string: static public image name (e.g., 'logo.png')
 *    - object: { type: 'storage' | 'asset', path: string }
 * @returns {string} full URL to image
 */
export function useImage(source: string | { type: 'storage' | 'asset'; path: string }) {
    return useMemo(() => {
        if (!source) return '';

        // If source is a string, assume public/assets/images folder
        if (typeof source === 'string') {
            return `/assets/images/${source}`;
        }

        // If source is an object
        if (typeof source === 'object') {
            const { type, path } = source;
            switch (type) {
                case 'asset':
                    return path; // Already full URL from controller via asset()
                case 'storage':
                    return `/storage/${path}`;
                default:
                    return path;
            }
        }

        return '';
    }, [source]);
}
