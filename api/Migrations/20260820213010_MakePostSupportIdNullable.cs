using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class MakePostSupportIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Supports_SupportId",
                table: "Posts");

            migrationBuilder.AlterColumn<Guid>(
                name: "SupportId",
                table: "Posts",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Supports_SupportId",
                table: "Posts",
                column: "SupportId",
                principalTable: "Supports",
                principalColumn: "SupportId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Supports_SupportId",
                table: "Posts");

            migrationBuilder.AlterColumn<Guid>(
                name: "SupportId",
                table: "Posts",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Supports_SupportId",
                table: "Posts",
                column: "SupportId",
                principalTable: "Supports",
                principalColumn: "SupportId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
