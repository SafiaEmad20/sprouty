namespace Sprouty.Api.OpenApi
{
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.OpenApi;
    using Microsoft.OpenApi;


    public sealed class BearerSecuritySchemeTransformer(
       IAuthenticationSchemeProvider authenticationSchemeProvider)
       : IOpenApiDocumentTransformer
    {
        public async Task TransformAsync(
            OpenApiDocument document,
            OpenApiDocumentTransformerContext context,
            CancellationToken cancellationToken)
        {
            var schemes = await authenticationSchemeProvider.GetAllSchemesAsync();
            if (!schemes.Any(scheme => scheme.Name == "Bearer"))
                return;
            // Scheme
            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes = new Dictionary<string, IOpenApiSecurityScheme>
            {
                ["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    In = ParameterLocation.Header,
                    BearerFormat = "JWT"
                }
            };
           
            document.Security ??= [];
            document.Security.Add(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecuritySchemeReference("Bearer", document),
                    new List<string>() 
                }
            });
        }
    }
}