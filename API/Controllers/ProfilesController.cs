using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController


    {


        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> GetTask(string username)
        {


            return await Mediator.Send(new Details.Query { UserName = username });
        }
        [HttpPut]
        public async Task<ActionResult<Unit>> Edie(Edit.Command command)
        {


            return await Mediator.Send(command);
        }

        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivities(string username,string predicate)
        {
            return await Mediator.Send(new ListActivities.Query{Username=username,Predicate=predicate});
        }



    }
}