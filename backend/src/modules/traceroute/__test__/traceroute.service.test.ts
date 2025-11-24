import { describe, it, expect, vi } from 'vitest';
import { TracerouteService } from '../traceroute.service';
import { execAsync } from '../../../utils/exec';

vi.mock('../../../utils/exec', () => ({
    execAsync: vi.fn(),
}));

describe('TracerouteService', () => {
    it('should parse successful traceroute output with multiple hops', async () => {
        (execAsync as any).mockResolvedValue({
            stdout: `
      traceroute to example.com
      1  192.168.1.1  1.12 ms  1.05 ms  1.08 ms
      2  10.0.0.1     5.32 ms  5.40 ms  5.28 ms
      `
        });

        const result = await TracerouteService.run({ target: 'example.com' });

        expect(result.hops.length).toBe(2);
        expect(result.hops[0].ip).toBe('192.168.1.1');
        expect(result.hops[0].latencies.length).toBe(3);
    });

    it('should detect timeout hops (*)', async () => {
        (execAsync as any).mockResolvedValue({
            stdout: `
      traceroute to example.com
      1  *
      2  10.0.0.1  5.32 ms  5.40 ms  5.28 ms
      `
        });

        const result = await TracerouteService.run({ target: 'example.com' });

        expect(result.hops[0].timeout).toBe(true);
        expect(result.hops[0].latencies.length).toBe(0);
    });

    it('should handle unreachable target / no route', async () => {
        (execAsync as any).mockRejectedValue(new Error('No route to host'));

        const result = await TracerouteService.run({ target: 'unknown.host' });

        expect(result.error).toBeDefined();
    });

    it('should handle invalid domain execution error', async () => {
        (execAsync as any).mockRejectedValue(new Error('Name or service not known'));

        const result = await TracerouteService.run({ target: 'invalid_domain' });

        expect(result.error).toContain('Name or service not known');
    });
});
