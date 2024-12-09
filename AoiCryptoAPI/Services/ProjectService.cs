using AoiCryptoAPI.Data;
using AoiCryptoAPI.Models;

namespace AoiCryptoAPI.Services
{
    public class ProjectService
    {
        private readonly MongoRepository<Project> _repository;

        public ProjectService(MongoRepository<Project> repository)
        {
            _repository = repository;
        }

        public List<Project> Get() => _repository.GetAll();

        public Project Get(string id) => _repository.Get(id);

        public void Create(Project project) => _repository.Create(project);

        public void Update(string id, Project project) => _repository.Update(id, project);

        public void Delete(string id) => _repository.Delete(id);
    }
}
