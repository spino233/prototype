import {
    createRxDatabase,
    addRxPlugin,
    lastOfArray
} from 'rxdb';
import {
    getRxStorageDexie
} from 'rxdb/plugins/storage-dexie';
import {
    sampleSchema
} from './Schema';

import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { replicateRxCollection } from 'rxdb/plugins/replication';
addRxPlugin(RxDBLeaderElectionPlugin);

const syncURL = 'http://localhost:8080/';
console.log('host: ' + syncURL);

let dbPromise = null;

const _create = async () => {
    console.log('DatabaseService: creating database..');
    const db = await createRxDatabase({
        name: 'samplereactdb',
        storage: getRxStorageDexie()
    });
    console.log('DatabaseService: created database');
    window['db'] = db; // write to window for debugging

    // show leadership in title
    db.waitForLeadership().then(() => {
        console.log('isLeader now');
        document.title = '♛ ' + document.title;
    });

    // create collections
    console.log('DatabaseService: create collections');
    await db.addCollections({
        sample: {
            schema: sampleSchema,
            methods: {
                hpPercent() {
                    return this.hp / this.maxHP * 100;
                }
            }
        }
    });

    // hooks
    /* console.log('DatabaseService: add hooks');
    db.collections.heroes.preInsert(docObj => {
        const { color } = docObj;
        return db.collections.heroes.findOne({
            selector: { color }
        }).exec().then(has => {
            if (has !== null) {
                console.error('another hero already has the color ' + color);
                throw new Error('color already there');
            }
            return db;
        });
    });
   */
    // sync

    console.log(db);

    console.log('DatabaseService: sync - start live');
    const url = syncURL.concat('sample').concat('/sync');
    console.log('url: ' + url);
    const replicationState = replicateRxCollection({
        collection: db["sample"],
        url,
        live: true,
        pull: {
            async handler(lastCheckpoint, batchSize) {
                const minTimestamp = lastCheckpoint ? lastCheckpoint.updatedAt : 0;
                /**
                 * In this example we replicate with a remote REST server
                 */
                const response = await fetch(
                    `http://localhost:8080/sample/sync?updatedAt=${minTimestamp}&limit=${batchSize}`
                );
                const documentsFromRemote = await response.json();
                console.log(lastOfArray(documentsFromRemote));
                return {
                    /**
                     * Contains the pulled documents from the remote.
                     * Notice: If documentsFromRemote.length < batchSize,
                     * then RxDB assumes that there are no more un-replicated documents
                     * on the backend, so the replication will switch to 'Event observation' mode.
                     */
                    documents: documentsFromRemote,
                    /**
                     * The last checkpoint of the returned documents.
                     * On the next call to the pull handler,
                     * this checkpoint will be passed as 'lastCheckpoint'
                     */
                    checkpoint: documentsFromRemote.length === 0 ? lastCheckpoint : {
                        id: lastOfArray(documentsFromRemote).id,
                        updatedAt: lastOfArray(documentsFromRemote).updatedAt
                    }
                };
            },
        },
        push: {
            async handler(docs) {
                console.log(docs.map(doc => doc.newDocumentState))
                const rawResponse = await fetch('http://localhost:8080/sample', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(docs.map(doc => doc.newDocumentState))
                });
                /**
                 * Contains an array with all conflicts that appeared during this push.
                 * If there were no conflicts, return an empty array.
                 */
                const response = await rawResponse.json();
                return response;
            },
            batchSize: 2,
            /**
             * Modifies all documents before they are given to the push handler.
             * Can be used to swap out a custom deleted flag instead of the '_deleted' field.
             * (optional)
             */
            modifier: d => d
        },
        liveInterval: 100 * 60 * 10,
        autoStart: true
    });

    await replicationState.awaitInSync();
    replicationState.error$.subscribe(err => {
        console.log('Got replication error:');
        console.dir(err);
    });

    // emits each document that was received from the remote
    replicationState.received$.subscribe(doc => console.dir(doc));

    // emits each document that was send to the remote
    replicationState.send$.subscribe(doc => console.dir(doc));

    // emits all errors that happen when running the push- & pull-handlers.
    replicationState.error$.subscribe(error => console.dir(error));

    // emits true when the replication was canceled, false when not.
    replicationState.canceled$.subscribe(bool => console.dir(bool));

    // emits true when a replication cycle is running, false when not.
    replicationState.active$.subscribe(bool => console.dir(bool));

    return db;
};

export const get = () => {
    if (!dbPromise)
        dbPromise = _create();
    return dbPromise;
};