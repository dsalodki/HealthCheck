using HealthCheckAPI;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddHealthChecks() //.AddCheck<ICMPHealthCheck>("ICMP");
    .AddCheck("ICMP_01",
        new ICMPHealthCheck("www.ryadel.com", 100))
    .AddCheck("ICMP_02",
        new ICMPHealthCheck("www.google.com", 100))
    .AddCheck("ICMP_03",
        new ICMPHealthCheck($"www.{Guid.NewGuid():N}.com", 100))
    ;
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var policyName = "AngularPolicy";
builder.Services.AddCors(options =>
    options.AddPolicy(name: policyName,
        cfg => {
            cfg.AllowAnyHeader();
            cfg.AllowAnyMethod();
            cfg.WithOrigins(builder.Configuration["AllowedCORS"]);
        }));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors(policyName);

app.UseHealthChecks(new PathString("/api/health"), new CustomHealthCheckOptions());

app.MapControllers();

app.MapMethods("api/heartbeat", new[] {"HEAD"}, () => Results.Ok());

app.Run();
