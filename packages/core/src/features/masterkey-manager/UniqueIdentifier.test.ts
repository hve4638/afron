import os from 'os';
import { describe, expect, test, vi } from 'vitest';
import UniqueIdentifier from './UniqueIdentifier';
import si from 'systeminformation';

vi.mock('systeminformation', () => ({
    default: {
        cpu: vi.fn(),
        baseboard: vi.fn(),
        uuid: vi.fn(),
    },
}));

describe('UniqueIdentifier', () => {
    test('makeAsHardwareNames combines cpu, board, and hostname', async () => {
        const cpuMock = vi.mocked(si.cpu);
        const baseboardMock = vi.mocked(si.baseboard);
        const hostnameMock = vi.spyOn(os, 'hostname').mockReturnValue('dev-host');

        cpuMock.mockResolvedValue({ brand: 'Intel Core i7' } as never);
        baseboardMock.mockResolvedValue({ model: 'ASUS Prime' } as never);

        const result = await UniqueIdentifier.makeAsHardwareNames();

        expect(result).toBe('IntelCorei7:ASUSPrime:dev-host');
        expect(cpuMock).toHaveBeenCalledTimes(1);
        expect(baseboardMock).toHaveBeenCalledTimes(1);

        hostnameMock.mockRestore();
    });
});
