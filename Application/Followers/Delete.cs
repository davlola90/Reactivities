using System.Threading;
using Application.Errors;
using Application.interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;

using System.Threading.Tasks;


namespace Application.Followers
{
    public class Delete
    {
        public class Command : IRequest
        {

            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);

                if (target == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { User = "NotFound" });

                var following = await _context.Followings.SingleOrDefaultAsync(x => x.ObserverId == observer.Id && x.TargetId == target.Id);

                if (following == null)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, new { User = "You Are Not Following this user Yet" });

                if (following != null)
                {
                   
                    _context.Followings.Remove(following);
                }



                //handler logic goes here
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Probelem saving Changes");

            }
        }
    }
}