using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class ExternalLogin
    {
        public class Query : IRequest<User>
        {


            public string accessToken { get; set; }
        }


        public class Handler : IRequestHandler<Query, User>
        {
            private readonly IFacebookAccessor _facebookAccessor;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly UserManager<AppUser> _userManager;

            public Handler(IFacebookAccessor facebookAccessor, IJwtGenerator jwtGenerator, UserManager<AppUser> userManager)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _facebookAccessor = facebookAccessor;

            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {

                var userInfo = await _facebookAccessor.FacebookLogin(request.accessToken);

                if (userInfo == null)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { User = "Problem Validation Token" });

                var user = await _userManager.FindByEmailAsync(userInfo.Email);

                if (user != null)
                {
                    user = new AppUser
                    {
                        DisplayName = userInfo.Name,
                        Id = userInfo.Id,
                        Email = userInfo.Email,
                        UserName = "fb_" + userInfo.Id
                    };
                    var photo = new Photo
                    {
                        Id = "fb_" + userInfo.Id,
                        Url = userInfo.Picture.Data.Url,
                        IsMain = true
                    };

                    user.Photos.Add(photo);

                    var result = await _userManager.CreateAsync(user);

                    if (!result.Succeeded)
                        throw new RestException(System.Net.HttpStatusCode.BadRequest, new { User = "Problem Creating User" });
                    //logic goes here}
                }

                return new User
                {
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    UserName = user.UserName,
                    Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url


                };


            }
        }
    }
}