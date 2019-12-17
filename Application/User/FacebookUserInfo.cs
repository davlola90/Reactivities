namespace Application.User
{
    public class FacebookUserInfo
    {

        public string Id { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public FacebookPictureData Picture { get; set; }
    }

    public class FacebookPictureData
    {

        public FaceBookPicture Data { get; set; }
    }

    public class FaceBookPicture
    {
        public string Url { get; set; }
    }
}