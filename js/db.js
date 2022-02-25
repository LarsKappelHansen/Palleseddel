// IndexedDB DB and Store Properties
const DB_NAME = 'palleapp-db';
const DB_VERSION = 1;
const STORE_NAME = 'palleapp-store';

function openIDB() {
  console.log('openIDB()');
  // open the indexedDB database used by the app
  return new Promise((resolve, reject) => {
    // open the feedback database
    let theDB = self.indexedDB.open(DB_NAME, DB_VERSION);

    // success callback
    theDB.onsuccess = function (event) {
      console.log('openIDB: Successfully opened database');
      // success, return the db object result
      resolve(event.target.result);
    };

    // define the database error callback
    theDB.onerror = function (event) {
      let msg = `Database error ${theDB.error}`;
      console.error(`openIDB: ${msg}`);
      //Swal.fire('Database Error', msg, 'error');
      // reject the promise, we failed
      // include the error message with the failure
      reject(msg);
    };

    theDB.onupgradeneeded = function (event) {
      console.log('openIDB: Database upgrade needed');
      // get a handle to the database
      var db = event.target.result;
      // does the store already exist?
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // no? Then create it
        console.log(`openIDB: Creating store ${STORE_NAME}`);
        // first create the configuration options for the store
        var storeOptions = { keyPath: "id", autoIncrement: true };
        // then create the store
        var theStore = db.createObjectStore(STORE_NAME, storeOptions);
      };
    };
    });
};

function saveData(data) {
    openIDB()
        .then(
        function (db) {
            var tx = db.transaction(STORE_NAME, 'readwrite');
            var store = tx.objectStore(STORE_NAME);
            store.add(data);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store os!');
        }
    );
}


