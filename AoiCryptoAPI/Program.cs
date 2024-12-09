using MongoDB.Driver;
using AoiCryptoAPI.Data;
using AoiCryptoAPI.Models;
using AoiCryptoAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Configure MongoDB
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
    new MongoClient(builder.Configuration.GetConnectionString("MongoDb")));

builder.Services.AddSingleton(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("AoiCrypto");
});

// Register Repositories
builder.Services.AddSingleton(sp =>
    new MongoRepository<Project>(sp.GetRequiredService<IMongoDatabase>(), "Projects"));
builder.Services.AddSingleton(sp =>
    new MongoRepository<Token>(sp.GetRequiredService<IMongoDatabase>(), "Token"));

builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<TokenService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();
