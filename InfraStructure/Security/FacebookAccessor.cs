using System;
using System.Net.Http;
using System.Threading.Tasks;
using Application.interfaces;
using Application.User;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace InfraStructure.Security
{
    public class FacebookAccessor : IFacebookAccessor
    {


        private readonly HttpClient _httpClient;

        private readonly IOptions<FacebookAppSettings> _config;

        public FacebookAccessor(IOptions<FacebookAppSettings> config)
        {
            _config = config;
            _httpClient = new HttpClient
            {
                BaseAddress = new System.Uri("https://graph.facebook.com/")
            };
            _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<FacebookUserInfo> FacebookLogin(string accessToken)
        {
            var verifyToken = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={_config.Value.AppId}|{_config.Value.AppSecret}");

            if (!verifyToken.IsSuccessStatusCode)
                return null;
            try
            {
                var result = await GetAsync<FacebookUserInfo>(accessToken, "me", "fields=name,email,picture.width(100).height(100)");
                return result;
            }
            catch(Exception ex)
            {
              Console.Write(ex);
                return null;
            }

        }

        private async Task<T> GetAsync<T>(string accessToken, string endpoint, string args)
        {
            var response = await _httpClient.GetAsync($"{endpoint},access_token={accessToken}&{args}");
            if (!response.IsSuccessStatusCode)
                return default(T);

            var result = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(result);


        }
    }
}