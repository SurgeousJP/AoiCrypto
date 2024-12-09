using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AoiCryptoAPI.Models
{
    public class Token
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        public string Address { get; set; }
        public string Name { get; set; }
        public string Symbol { get; set; }
        public decimal InitialSupply { get; set; }
        public decimal MaxSupply { get; set; }
    }
}
