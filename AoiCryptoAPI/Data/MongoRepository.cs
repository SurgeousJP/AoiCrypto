using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq.Expressions;

namespace AoiCryptoAPI.Data
{
    public class MongoRepository<T> where T : class
    {
        private readonly IMongoCollection<T> _collection;

        public MongoRepository(IMongoDatabase database, string collectionName)
        {
            _collection = database.GetCollection<T>(collectionName);
        }

        public List<T> GetAll() => _collection.Find(_ => true).ToList();

        public T Get(string id) =>
            _collection.Find(Builders<T>.Filter.Eq("_id", ObjectId.Parse(id))).FirstOrDefault();

        public void Create(T entity) => _collection.InsertOne(entity);

        public void Update(string id, T entity) =>
            _collection.ReplaceOne(Builders<T>.Filter.Eq("_id", ObjectId.Parse(id)), entity);

        public void Delete(string id) =>
            _collection.DeleteOne(Builders<T>.Filter.Eq("_id", ObjectId.Parse(id)));

        public List<T> Find(Expression<Func<T, bool>> filter) =>
            _collection.Find(filter).ToList();
    }
}
