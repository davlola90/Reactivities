using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {

            public string Body { get; set; }

            public Guid ActivityId { get; set; }
            public string UserName { get; set; }


        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {

                var activity = await _context.Activities.FindAsync(request.ActivityId);
                if (activity == null)
                    throw new RestException(System.Net.HttpStatusCode.NotFound, new { Activity = "Acitivity Not Found" });

                var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == request.UserName);

                var coment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    CreatedAt = DateTime.Now,
                    Body = request.Body

                };


                activity.Comments.Add(coment);

                //handler logic goes here
                var success = await _context.SaveChangesAsync() > 0;
                var rs = _mapper.Map<CommentDto>(coment);
                if (success) return rs;
                throw new Exception("Probelem saving Changes");

            }
        }
    }
}