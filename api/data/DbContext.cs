using Api.Model;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options) { }
  public DbSet<Admin> Admins => Set<Admin>();
  public DbSet<Craft> Crafts => Set<Craft>();
  public DbSet<CraftFavorite> CraftFavorites => Set<CraftFavorite>();
  public DbSet<Follow> Follows => Set<Follow>();
  public DbSet<Like> Likes => Set<Like>();
  public DbSet<Post> Posts => Set<Post>();
  public DbSet<PostMedia> PostMedia => Set<PostMedia>();
  public DbSet<PostTag> PostTags => Set<PostTag>();
  public DbSet<Subscription> Subscriptions => Set<Subscription>();
  public DbSet<Support> Supports => Set<Support>();
  public DbSet<Tag> Tags => Set<Tag>();
  public DbSet<User> Users => Set<User>();
  public DbSet<UserTag> UserTags => Set<UserTag>();
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

    modelBuilder
      .Entity<CraftFavorite>()
      .HasOne(cf => cf.User)
      .WithMany(u => u.CraftFavorites)
      .HasForeignKey(cf => cf.UserId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder
      .Entity<CraftFavorite>()
      .HasOne(cf => cf.Craft)
      .WithMany(c => c.Favorites)
      .HasForeignKey(cf => cf.CraftId)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<CraftFavorite>().HasIndex(cf => new { cf.UserId, cf.CraftId }).IsUnique();

    modelBuilder
      .Entity<User>()
      .HasOne(u => u.Craft)
      .WithMany(c => c.Successors)
      .HasForeignKey(u => u.CraftId)
      .OnDelete(DeleteBehavior.SetNull);
    modelBuilder.Entity<Post>();
    modelBuilder.Entity<PostTag>().HasKey(pt => new {pt.PostId, pt.TagId});
    modelBuilder.Entity<UserTag>().HasKey(ut => new { ut.UserId, ut.TagId });
    modelBuilder.Entity<Like>().HasIndex(l => new { l.UserId, l.PostId }).IsUnique();
    modelBuilder.Entity<Subscription>().Property(r => r.Status).HasConversion<string>();
    modelBuilder.Entity<PostMedia>().Property(m => m.Type).HasConversion<string>();
  }
}