package internals

import (
	"burned-toast/backend/debug"
	"burned-toast/backend/utils"
	"encoding/json"
	"log"

	"github.com/akrylysov/pogreb"
)

// Provides methods for interacting with a JSON-based cache database.
// It uses [pogreb] for efficient key-value storage and JSON for data serialization.
type JSONCacheUtils struct {
	// The underlying [pogreb] database.
	db *pogreb.DB
}

// Stores a value in the cache with the given key.
// It converts any type into json string before storing it.
//
// Returns an error if the value cannot be encoded to json string or stored.
//
// Parameters:
//   - key: The key to store the value under.
//   - value: The value to store, if it cannot convert into json string, it panics.
func (cache *JSONCacheUtils) Set(key string, value any) {
	jsonInBinary, err := json.Marshal(&value)
	if err != nil {
		debug.Err(err)
		return
	}

	keyInBinary := []byte(key)
	isThisKeyExist, err := cache.db.Has(keyInBinary)
	if err != nil {
		debug.Err(err)
		return
	}

	if isThisKeyExist {
		cache.Delete(key)
	}

	err = cache.db.Put(keyInBinary, jsonInBinary)
	if err != nil {
		debug.Err(err)
		return
	}
}

// Retrieves a value from the cache with the given key.
// It converts the stringified JSON data back to the original type.
//
// Returns
//   - an error if the key is not found
//   - or the data cannot be decoded.
//
// Parameters:
//   - key: The key to retrieve the value for.
//   - outData: A pointer to the variable where the retrieved value will be stored.
func (cache *JSONCacheUtils) Get(key string, outData any) error {
	debug.Infof(" | Get: %s", key)
	value, readError := cache.db.Get([]byte(key))
	if readError != nil {
		debug.Err(" | ", "err", readError)
		return readError
	}

	json.Unmarshal(value, &outData)
	return nil
}

// Removes a value from the cache with the given key.
//
// Returns an error if the key cannot be deleted.
//
// Parameters:
//   - key: The key to delete.
func (cache *JSONCacheUtils) Delete(key string) error {
	debug.Infof(" | Delete: %s", key)
	err := cache.db.Delete([]byte(key))
	if err != nil {
		debug.Err(" | ", "err", err)
		return err
	}

	cache.db.Compact()
	cache.db.Sync()

	return nil
}

// Retrieves all values from the cache as a slice of any type.
//
// Returns an array containing all values in the cache.
func (cache *JSONCacheUtils) GetAllValue() []any {
	var item []any
	irritateEachItemOnCache(cache.db, func(key []byte, value []byte) {
		var jsonVal any
		json.Unmarshal(value, &jsonVal)
		item = append(item, jsonVal)
	})

	return item
}

// Retrieves all key-value pairs from the cache as a map.
//
// Returns a map containing all key-value pairs in the cache.
func (cache *JSONCacheUtils) GetAll() map[string]any {
	outMap := make(map[string]any)
	irritateEachItemOnCache(cache.db, func(key []byte, value []byte) {
		var jsonVal any
		json.Unmarshal(value, &jsonVal)
		outMap[utils.BytesToString(key)] = jsonVal
		debug.Info(" | ", utils.BytesToString(key), jsonVal)
	})

	return outMap
}

// A function type for iterating over cache items.
//
// Sounds like a javascript callback...
type IrritateItemFn func(key []byte, value []byte)

// Iterates over all items in the cache database.
//
// Parameters:
//   - db: The pogreb database.
//   - eachItem: The function to call for each item. See [IrritateItemFn]
func irritateEachItemOnCache(db *pogreb.DB, eachItem IrritateItemFn) {
	it := db.Items()
	for {
		key, val, err := it.Next()
		if err == pogreb.ErrIterationDone {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		eachItem(key, val)
	}
}

// A function type for messing with the cache database.
type CacheModificationFn func(thisCache *JSONCacheUtils)

// Opens a pogreb database, calls the provided function to modify it, and closes the database.
//
// Note: it only deals with json value only.
//
// Parameters:
//   - dbName: The name of the database.
//   - updateFn: The function to call to modify the database.
func OpenDb(dbName string, updateFn CacheModificationFn) {
	dbPath := utils.JoinPath(CacheFolderPath, dbName)
	cacheDb, dbError := pogreb.Open(dbPath, nil /*no options*/)

	if dbError != nil {
		debug.Err(dbError)
		return
	}

	debug.Info("[cache db] make some mess to the server database now -> ", "name", dbName)

	updateFn(&JSONCacheUtils{
		db: cacheDb,
	})

	cacheDb.Close()
	debug.Info("[cache db] database closed -> ", "name", dbName)
}
