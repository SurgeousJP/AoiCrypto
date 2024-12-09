using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AoiCryptoAPI.Models
{
    public class Project
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string PoolAddress { get; set; }
        public string TokenAddress { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageBannerUrl { get; set; }
    }
}
