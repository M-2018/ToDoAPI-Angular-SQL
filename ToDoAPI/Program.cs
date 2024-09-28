using Microsoft.EntityFrameworkCore;
using ToDoAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//Inject Dbcontext and allow CORS
builder.Services.AddDbContext<ToDoAPIDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("ToDoDbConnectionString")));

//builder.Services.AddCors((setup) =>
//{
//    setup.AddPolicy("default", (options) =>
//    {
//        options.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
//    });
//});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        builder => builder.WithOrigins("http://localhost:4200") // Ajusta esto al puerto de tu app Angular
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});





var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//Enable use of CORS
app.UseCors("AllowAngularApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
