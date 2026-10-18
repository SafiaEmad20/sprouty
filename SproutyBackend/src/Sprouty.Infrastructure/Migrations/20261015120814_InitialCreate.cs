using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Sprouty.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "plant_types",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plant_types", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "plant_requirements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlantTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MinMoisture = table.Column<float>(type: "real", nullable: false),
                    MaxMoisture = table.Column<float>(type: "real", nullable: false),
                    MinTemperature = table.Column<float>(type: "real", nullable: false),
                    MaxTemperature = table.Column<float>(type: "real", nullable: false),
                    MinHumidity = table.Column<float>(type: "real", nullable: false),
                    MaxHumidity = table.Column<float>(type: "real", nullable: false),
                    MinLight = table.Column<float>(type: "real", nullable: false),
                    MaxLight = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plant_requirements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_plant_requirements_plant_types_PlantTypeId",
                        column: x => x.PlantTypeId,
                        principalTable: "plant_types",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "plants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlantTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nickname = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AddedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_plants_plant_types_PlantTypeId",
                        column: x => x.PlantTypeId,
                        principalTable: "plant_types",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_plants_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_notifications_plants_PlantId",
                        column: x => x.PlantId,
                        principalTable: "plants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "plant_statuses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StatusType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Message = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    ComputedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plant_statuses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_plant_statuses_plants_PlantId",
                        column: x => x.PlantId,
                        principalTable: "plants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sensors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeviceCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    LastSeenAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sensors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sensors_plants_PlantId",
                        column: x => x.PlantId,
                        principalTable: "plants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sensor_readings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SensorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Moisture = table.Column<double>(type: "float", nullable: false),
                    Temperature = table.Column<double>(type: "float", nullable: false),
                    Humidity = table.Column<double>(type: "float", nullable: false),
                    Light = table.Column<double>(type: "float", nullable: false),
                    RecordedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSUTCDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sensor_readings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sensor_readings_sensors_SensorId",
                        column: x => x.SensorId,
                        principalTable: "sensors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "plant_types",
                columns: new[] { "Id", "Category", "ImageUrl", "NameAr", "NameEn" },
                values: new object[,]
                {
                    { new Guid("a1000000-0000-0000-0000-000000000001"), "أعشاب", null, "ريحان", "Basil" },
                    { new Guid("a1000000-0000-0000-0000-000000000002"), "أعشاب", null, "نعناع", "Mint" },
                    { new Guid("a1000000-0000-0000-0000-000000000003"), "زهور", null, "زهور", "Flowers" },
                    { new Guid("a1000000-0000-0000-0000-000000000004"), "عام", null, "نوع عام", "Generic" }
                });

            migrationBuilder.InsertData(
                table: "plant_requirements",
                columns: new[] { "Id", "MaxHumidity", "MaxLight", "MaxMoisture", "MaxTemperature", "MinHumidity", "MinLight", "MinMoisture", "MinTemperature", "PlantTypeId" },
                values: new object[,]
                {
                    { new Guid("b1000000-0000-0000-0000-000000000001"), 70f, 20000f, 70f, 30f, 40f, 5000f, 40f, 18f, new Guid("a1000000-0000-0000-0000-000000000001") },
                    { new Guid("b1000000-0000-0000-0000-000000000002"), 70f, 15000f, 80f, 27f, 40f, 3000f, 50f, 15f, new Guid("a1000000-0000-0000-0000-000000000002") },
                    { new Guid("b1000000-0000-0000-0000-000000000003"), 60f, 30000f, 70f, 28f, 40f, 10000f, 40f, 15f, new Guid("a1000000-0000-0000-0000-000000000003") },
                    { new Guid("b1000000-0000-0000-0000-000000000004"), 70f, 20000f, 70f, 30f, 30f, 2000f, 30f, 15f, new Guid("a1000000-0000-0000-0000-000000000004") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_notifications_PlantId_IsRead",
                table: "notifications",
                columns: new[] { "PlantId", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_plant_requirements_PlantTypeId",
                table: "plant_requirements",
                column: "PlantTypeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_plant_statuses_PlantId_ComputedAt",
                table: "plant_statuses",
                columns: new[] { "PlantId", "ComputedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_plants_PlantTypeId",
                table: "plants",
                column: "PlantTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_plants_UserId",
                table: "plants",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_sensor_readings_SensorId_RecordedAt",
                table: "sensor_readings",
                columns: new[] { "SensorId", "RecordedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_sensors_DeviceCode",
                table: "sensors",
                column: "DeviceCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_sensors_PlantId",
                table: "sensors",
                column: "PlantId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "notifications");

            migrationBuilder.DropTable(
                name: "plant_requirements");

            migrationBuilder.DropTable(
                name: "plant_statuses");

            migrationBuilder.DropTable(
                name: "sensor_readings");

            migrationBuilder.DropTable(
                name: "sensors");

            migrationBuilder.DropTable(
                name: "plants");

            migrationBuilder.DropTable(
                name: "plant_types");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
