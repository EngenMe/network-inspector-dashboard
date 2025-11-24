import { describe, it, expect } from 'vitest';
import { TracerouteService } from '../traceroute.service';

describe('TracerouteService', () => {
    it('should run traceroute', async () => {
        const result = await TracerouteService.run({ target: 'example.com' });
        expect(result).toBeDefined();
    });
});
