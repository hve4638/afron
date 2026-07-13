import { beforeEach, describe, expect, test, vi } from 'vitest';
import MasterKeyManager from './MasterKeyManager';
import { MasterKeyInitResult } from './types';
import UniqueIdentifier from './UniqueIdentifier';

const mockReadData = vi.fn<(...args: [string]) => Promise<string[]>>();
const mockAppendData = vi.fn<(...args: [string, string[]]) => Promise<void>>();
const mockDeleteData = vi.fn<(...args: [string]) => Promise<void>>();
const mockEncrypt = vi.fn<(...args: [string, string]) => Promise<string>>();
const mockDecrypt = vi.fn<(...args: [string, string]) => Promise<string>>();
const mockGenerateKey = vi.fn<() => Promise<string>>();

vi.mock('./UniqueIdentifier', () => ({
    default: {
        makeAsHardwareNames: vi.fn(),
    },
}));

describe('MasterKeyManager', () => {
    const createManager = () => {
        const manager = new MasterKeyManager('mock-target');

        Object.assign(manager, {
            fsUtil: {
                readData: mockReadData,
                appendData: mockAppendData,
                deleteData: mockDeleteData,
            },
            encryptModel: {
                encrypt: mockEncrypt,
                decrypt: mockDecrypt,
                generateKey: mockGenerateKey,
            },
        });

        return manager;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('init initializes raw data, hardware key, and master key', async () => {
        const manager = createManager();

        mockReadData.mockResolvedValue(['encrypted-data']);
        vi.mocked(UniqueIdentifier.makeAsHardwareNames).mockResolvedValue('hardware-key');
        mockDecrypt.mockResolvedValue('master-key');

        const result = await manager.init();

        expect(result).toBe(MasterKeyInitResult.Normal);
        expect(mockReadData).toHaveBeenCalledTimes(1);
        expect(UniqueIdentifier.makeAsHardwareNames).toHaveBeenCalledTimes(1);
        expect(mockDecrypt).toHaveBeenCalledWith('encrypted-data', 'hardware-key');
        expect(manager.masterKey).toBe('master-key');
    });

    test('init returns NoData when storage is empty', async () => {
        const manager = createManager();
        mockReadData.mockResolvedValue([]);

        const result = await manager.init();

        expect(result).toBe(MasterKeyInitResult.NoData);
        expect(UniqueIdentifier.makeAsHardwareNames).not.toHaveBeenCalled();
        expect(mockDecrypt).not.toHaveBeenCalled();
    });

    test('init returns NeedRecovery when decrypt fails for all entries', async () => {
        const manager = createManager();

        mockReadData.mockResolvedValue(['encrypted-1', 'encrypted-2']);
        vi.mocked(UniqueIdentifier.makeAsHardwareNames).mockResolvedValue('hardware-key');
        mockDecrypt.mockRejectedValue(new Error('fail'));

        const result = await manager.init();

        expect(result).toBe(MasterKeyInitResult.NeedRecovery);
        expect(mockDecrypt).toHaveBeenCalledTimes(2);
        expect(manager.masterKey).toBeNull();
    });
});
