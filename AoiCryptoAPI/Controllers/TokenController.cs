using Microsoft.AspNetCore.Mvc;
using AoiCryptoAPI.Models;
using AoiCryptoAPI.Services;

namespace AoiCryptoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly TokenService _tokenService;

        public TokenController(TokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpGet]
        public ActionResult<List<Token>> Get() => _tokenService.Get();

        [HttpGet("{id:length(24)}", Name = "GetToken")]
        public ActionResult<Token> Get(string id)
        {
            var token = _tokenService.Get(id);

            if (token == null)
            {
                return NotFound();
            }

            return token;
        }

        [HttpGet("address/{address}")]
        public ActionResult<Token> GetByAddress(string address)
        {
            var token = _tokenService.FindByAddress(address);

            if (token == null)
            {
                return NotFound();
            }

            return token;
        }

        [HttpPost]
        public ActionResult<Token> Create(Token token)
        {
            _tokenService.Create(token);
            return CreatedAtRoute("GetToken", new { id = token.Id }, token);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Token tokenIn)
        {
            var token = _tokenService.Get(id);

            if (token == null)
            {
                return NotFound();
            }

            _tokenService.Update(id, tokenIn);
            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var token = _tokenService.Get(id);

            if (token == null)
            {
                return NotFound();
            }

            _tokenService.Delete(id);
            return NoContent();
        }
    }
}
