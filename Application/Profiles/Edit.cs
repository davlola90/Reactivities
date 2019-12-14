using System;
using System.Threading;
using System.Threading.Tasks;
using Application.interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest
        {

            public string Displayname { get; set; }
            public string Bio { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Displayname).NotEmpty();
                //RuleFor(x => x.Bio).NotEmpty();


            }

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

                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());
                user.DisplayName = request.Displayname ?? user.DisplayName;
                user.Bio = request.Bio ?? user.Bio;

                //handler logic goes here
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;
                throw new Exception("Probelem saving Changes");

            }
        }
    }
}