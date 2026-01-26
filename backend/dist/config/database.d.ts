import { Db } from 'mongodb';
export declare function connectDatabase(): Promise<Db>;
export declare function createIndexes(database: Db): Promise<void>;
export declare function getDatabase(): Db;
export declare function disconnectDatabase(): Promise<void>;
export declare function checkDatabaseHealth(): Promise<boolean>;
//# sourceMappingURL=database.d.ts.map