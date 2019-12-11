using System.Linq;
using System.Security.Claims;
using Application.interfaces;
using Microsoft.AspNetCore.Http;

namespace InfraStructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContectAccessor;
        public UserAccessor(IHttpContextAccessor httpContectAccessor)
        {
            _httpContectAccessor = httpContectAccessor;

        }
        public string GetCurrentUsername()
        {
          var userName = _httpContectAccessor.HttpContext.User?.Claims?.FirstOrDefault(
              x =>x.Type == ClaimTypes.NameIdentifier)?.Value;

              return userName;
          
        }
    }
}