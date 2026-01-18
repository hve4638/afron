import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import AfronLogger from './AfronLogger';
import { LogLevel } from './types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const formatDateForFile = (date: Date) => {
    const year = String(date.getFullYear()).slice(2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
};

describe('AfronLogger', () => {
    it('writes formatted log line with meta', async () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'afron-logger-'));
        const logger = new AfronLogger(tempDir, { level: LogLevel.TRACE });

        try {
            logger.info('hello', { foo: 'bar' });

            await delay(100);

            const logFile = path.join(tempDir, `app-${formatDateForFile(new Date())}.log`);
            const content = fs.readFileSync(logFile, 'utf8');
            const line = content.split(/\r?\n/).find((item) => item.includes('hello'));

            expect(line).toBeTruthy();
            expect(line).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z info:\thello \{"foo":"bar"\}$/);

        } finally {
            logger.close();

            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it('filters logs below the configured level', async () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'afron-logger-'));
        const logger = new AfronLogger(tempDir, { level: LogLevel.WARN });

        try {
            logger.info('skip');
            logger.warn('keep');

            await delay(100);

            const logFile = path.join(tempDir, `app-${formatDateForFile(new Date())}.log`);
            const content = fs.readFileSync(logFile, 'utf8');

            expect(content).toContain('warn:\tkeep');
            expect(content).not.toContain('info:\tskip');

        } finally {
            logger.close();

            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    it('writes debug and trace logs with json format', async () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'afron-logger-'));
        const logger = new AfronLogger(tempDir, { level: LogLevel.TRACE });

        try {
            logger.info('hello');
            logger.debug('details');
            logger.trace('trace');

            await delay(100);

            const dateSuffix = formatDateForFile(new Date());
            const debugFile = path.join(tempDir, `app-${dateSuffix}.debug.log`);
            const traceFile = path.join(tempDir, `app-${dateSuffix}.trace.log`);

            const debugContent = fs.readFileSync(debugFile, 'utf8');
            const traceContent = fs.readFileSync(traceFile, 'utf8');

            const debugLines = debugContent.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
            const traceLines = traceContent.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));

            expect(debugLines.some((entry) => entry.message === 'hello' && entry.level === 'info')).toBe(true);
            expect(debugLines.some((entry) => entry.message === 'details' && entry.level === 'debug')).toBe(true);
            expect(debugLines.some((entry) => entry.message === 'trace')).toBe(false);

            expect(traceLines.some((entry) => entry.message === 'hello' && entry.level === 'info')).toBe(true);
            expect(traceLines.some((entry) => entry.message === 'details' && entry.level === 'debug')).toBe(true);
            expect(traceLines.some((entry) => entry.message === 'trace' && entry.level === 'trace')).toBe(true);

        } finally {
            logger.close();

            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
});
