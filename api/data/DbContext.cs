using Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options) { }
  public DbSet<Follow> Follows => Set<Follow>();
  public DbSet<Like> Likes => Set<Like>();
  public DbSet<Post> Posts => Set<Post>();
  public DbSet<PostMedia> PostMedia => Set<PostMedia>();
  public DbSet<PostTag> PostTags => Set<PostTag>();
  public DbSet<Subscription> Subscriptions => Set<Subscription>();
  public DbSet<Support> Supports => Set<Support>();
  public DbSet<Tag> Tags => Set<Tag>();
  public DbSet<User> Users => Set<User>();
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder
      .Entity<Follow>()
      .HasOne(f => f.Follower)
      .WithMany(u => u.Followers)
      .HasForeignKey(f => f.FollowerId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder
      .Entity<Follow>()
      .HasOne(f => f.Followed)
      .WithMany(u => u.Followeds)
      .HasForeignKey(f => f.FollowedId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Follow>().HasIndex(f => new { f.FollowerId, f.FollowedId }).IsUnique();
    modelBuilder.Entity<Post>();
    modelBuilder.Entity<PostTag>().HasKey(pt => new {pt.PostId, pt.TagId});
    modelBuilder.Entity<Like>().HasIndex(l => new { l.UserId, l.PostId }).IsUnique();
    modelBuilder.Entity<Subscription>().Property(r => r.Status).HasConversion<string>();
    modelBuilder.Entity<PostMedia>().Property(m => m.Type).HasConversion<string>();
  }
}