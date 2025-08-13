import Database, { Database as DB } from 'better-sqlite3';
import { HISTORY_VERSION, MESSAGES_VERSION } from './data';
import { type LevelLogger } from '@/types';
import NoLogger from '@/features/nologger';

class HistoryMigrationManager {
    #db: DB;
    #logger: any;

    constructor(db: DB, logger?: LevelLogger) {
        this.#db = db;
        this.#logger = logger ?? NoLogger.instance;
    }

    public migrate(): void {
        this.ensureVersionTable();

        const query = this.#db.prepare(
            `SELECT version
            FROM version
            WHERE name = $name`
        );
        const row = query.get({ name: 'messages' }) as { version: number } | undefined;

        let version: number = 0;
        if (row) version = row.version;
        else version = 0;

        if (version < MESSAGES_VERSION) {
            switch (version) {
                case 0:
                    this.migrateMessages0to1();
                    break;
                default:
                    throw new Error(`Unsupported messages version: ${version}`);
            }
        }
        else {
            // no migration
        }
    }

    private ensureVersionTable(): void {
        this.#db.exec(`
            CREATE TABLE IF NOT EXISTS version (
                name TEXT,
                version INTEGER
            )
        `);
    }

    private migrateMessages0to1(): void{
        this.#logger.info('Migrating historyDB(messages) (v0 to v1)');
        this.#db.transaction(() => {
            this.#db.exec(`
                ALTER TABLE messages RENAME TO messages_old;
            `);

            this.#db.exec(`
                CREATE TABLE messages (
                    id INTEGER PRIMARY KEY,
                    history_id INTEGER,
                    message_index INTEGER NOT NULL,
                    message_type TEXT,

                    origin TEXT CHECK(origin IN ('in', 'out')),

                    text TEXT,
                    data TEXT,
                    data_name TEXT,
                    data_type TEXT,
                    data_thumbnail TEXT,

                    token_count INTEGER NOT NULL,
                    FOREIGN KEY (history_id) REFERENCES history(id) ON DELETE CASCADE
                )
            `);

            this.#db.exec(`
                INSERT INTO messages (
                    id, history_id, message_index, message_type,
                    origin, text, data, token_count
                )
                SELECT
                    id, history_id, message_index, message_type,
                    origin, text, data, token_count
                FROM messages_old;
            `);

            // 4. 기존 테이블 삭제
            this.#db.exec(`
                DROP TABLE messages_old
            `);

            // 5. 버전 테이블 갱신
            this.#db.prepare(`
                DELETE FROM version WHERE name = 'messages'
            `).run();
            this.#db.prepare(`
                INSERT INTO version (name, version) VALUES (?, ?)
            `).run('messages', 1);
        })();
        
        this.#logger.info('Successfully migrated historyDB(messages) to v1');
    }
}

export default HistoryMigrationManager;
