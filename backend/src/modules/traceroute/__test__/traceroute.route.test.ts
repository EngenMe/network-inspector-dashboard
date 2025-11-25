import { describe, it, expect, vi } from 'vitest';
import Fastify from 'fastify';
import tracerouteRoute from '../../../routes/traceroute.route';
import { execAsync } from '../../../utils/exec';

vi.mock('../../../utils/exec', () => ({
    execAsync: vi.fn(),
}));

const buildApp = async () => {
    const app = Fastify();
    app.register(tracerouteRoute, { prefix: '/api' });
    await app.ready();
    return app;
};

describe('Traceroute Route', () => {
    it('should return traceroute result successfully', async () => {
        (execAsync as any).mockResolvedValue({
            stdout: `
      traceroute to example.com
      1  1.1.1.1  10 ms  11 ms  12 ms
      `,
        });

        const app = await buildApp();

        const res = await app.inject({
            method: 'GET',
            url: '/api/traceroute?target=example.com',
        });

        expect(res.statusCode).toBe(200);
        expect(res.json().hops.length).toBe(1);
    });

    it('should return 400 when target param is missing', async () => {
        const app = await buildApp();

        const res = await app.inject({
            method: 'GET',
            url: '/api/traceroute',
        });

        expect(res.statusCode).toBe(400);
    });

    it('should return 400 for invalid target format', async () => {
        const app = await buildApp();

        const res = await app.inject({
            method: 'GET',
            url: '/api/traceroute?target=',
        });

        expect(res.statusCode).toBe(400);
    });

    it('should return 500 when traceroute command fails', async () => {
        (execAsync as any).mockRejectedValue(new Error('Traceroute failed'));

        const app = await buildApp();

        const res = await app.inject({
            method: 'GET',
            url: '/api/traceroute?target=error.com',
        });

        expect(res.statusCode).toBe(500);
    });
});
