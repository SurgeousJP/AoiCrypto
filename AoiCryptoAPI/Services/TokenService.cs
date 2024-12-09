using AoiCryptoAPI.Data;
using AoiCryptoAPI.Models;

namespace AoiCryptoAPI.Services
{
    public class TokenService
    {
        private readonly MongoRepository<Token> _repository;

        public TokenService(MongoRepository<Token> repository)
        {
            _repository = repository;
        }

        public List<Token> Get() => _repository.GetAll();

        public Token Get(string id) => _repository.Get(id);

        public void Create(Token token) => _repository.Create(token);

        public void Update(string id, Token token) => _repository.Update(id, token);

        public void Delete(string id) => _repository.Delete(id);

        public Token FindByAddress(string address) =>
            _repository.Find(token => token.Address == address).FirstOrDefault();
    }
}
