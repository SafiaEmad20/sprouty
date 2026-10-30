using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sprouty.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePlantLightRanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "plant_requirements",
                keyColumn: "Id",
                keyValue: new Guid("b1000000-0000-0000-0000-000000000001"),
                columns: new[] { "MaxLight", "MinLight" },
                values: new object[] { 90f, 40f });

            migrationBuilder.UpdateData(
                table: "plant_requirements",
                keyColumn: "Id",
                keyValue: new Guid("b1000000-0000-0000-0000-000000000002"),
                columns: new[] { "MaxLight", "MinLight" },
                values: new object[] { 80f, 30f });

            migrationBuilder.UpdateData(
                table: "plant_requirements",
                keyColumn: "Id",
                keyValue: new Guid("b1000000-0000-0000-0000-000000000003"),
                columns: new[] { "MaxLight", "MinLight" },
                values: new object[] { 100f, 50f });

            migrationBuilder.UpdateData(
                table: "plant_requirements",
                keyColumn: "Id",
                keyValue: new Guid("b1000000-0000-0000-0000-000000000004"),
                columns: new[] { "MaxLight", "MinLight" },
                values: new object[] { 80f, 20f });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "plant_requirements",
                keyColumn: "Id",
                keyValue: new Guid("b1000000-0000-0000-0000-000000000001"),
                columns: new[] { "MaxLight", "MinLight" },
                values: new object[] { 20000f, 5000f });

            migrationBuilder.UpdateData(
                table: "plant_requirements",
                keyColumn: "Id",
                keyValue: new Guid("b1000000-0000-0000-0000-000000000002"),
                columns: new[] { "MaxLight", "MinLight" },
                values: new object[] { 15000f, 3000f });

            migrationBuilder.UpdateData(
                table: "plant_requirements",
                keyColumn: "Id",
                keyValue: new Guid("b1000000-0000-0000-0000-000000000003"),
                columns: new[] { "MaxLight", "MinLight" },
                values: new object[] { 30000f, 10000f });

            migrationBuilder.UpdateData(
                table: "plant_requirements",
                keyColumn: "Id",
                keyValue: new Guid("b1000000-0000-0000-0000-000000000004"),
                columns: new[] { "MaxLight", "MinLight" },
                values: new object[] { 20000f, 2000f });
        }
    }
}
