using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace api.Extensions
{
    public static class ClaimsExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }
    }
}
