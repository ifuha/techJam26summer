using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddCraftDetailFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Crafts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Certification",
                table: "Crafts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Features",
                table: "Crafts",
                type: "text[]",
                nullable: false,
                defaultValueSql: "'{}'");

            migrationBuilder.AddColumn<List<string>>(
                name: "ProductionAreas",
                table: "Crafts",
                type: "text[]",
                nullable: false,
                defaultValueSql: "'{}'");

            migrationBuilder.AddColumn<string>(
                name: "Reading",
                table: "Crafts",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Crafts");

            migrationBuilder.DropColumn(
                name: "Certification",
                table: "Crafts");

            migrationBuilder.DropColumn(
                name: "Features",
                table: "Crafts");

            migrationBuilder.DropColumn(
                name: "ProductionAreas",
                table: "Crafts");

            migrationBuilder.DropColumn(
                name: "Reading",
                table: "Crafts");
        }
    }
}
