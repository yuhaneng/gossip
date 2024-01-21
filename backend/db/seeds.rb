# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

admin = User.new(
    username: "admin",
    email: "admin@email.com",
    password: "admin",
    admin: true
)
user1 = User.new(
    username: "user1",
    email: "user1@email.com",
    password: "password",
    admin: false
)
user2 = User.new(
    username: "user2",
    email: "user2@email.com",
    password: "password",
    admin: false
)
admin.save
user1.save
user2.save

user_ids = [admin.id, user1.id, user2.id]

lorem_ipsums = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In risus nisl, sodales porta mattis id, tincidunt eu ante. Duis lorem massa, faucibus vel mauris sed, porta placerat ligula. In laoreet pulvinar velit, at semper tortor vestibulum nec.",
    "Proin blandit imperdiet velit, et sollicitudin dolor blandit id. Aliquam eu scelerisque leo, vel porta est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Aliquam rhoncus molestie condimentum. Sed id nulla ipsum. Vivamus rhoncus nulla ornare orci ultrices, non vulputate nunc sagittis. Nullam sed porttitor dolor. Curabitur imperdiet suscipit blandit.",
    "Nunc elementum volutpat lacus et maximus. Sed cursus, dolor non eleifend gravida, felis ligula facilisis nisl, in viverra ante dui sodales risus. In vestibulum arcu mi, non iaculis ipsum maximus vitae.",
    "Duis dignissim leo aliquet, dapibus nibh id, mattis augue. Nunc ac odio a tellus eleifend pretium. Ut fermentum mattis consectetur. In dapibus massa id ultricies congue. Nulla ac feugiat dolor, vel venenatis libero."
]

for x in 0..24 do
    post = Post.new(
        title: "Post #{x}", 
        content: lorem_ipsums[x % 5],
        tags: ["tag#{x}", "tag#{x+1}", "tag#{x+2}"],
        user_id: user_ids[x % 3]
    )
    post.save
end

for x in 0..24 do
    comment = Comment.new(
        content: lorem_ipsums[x % 5],
        user_id: user_ids[(x + 1) % 3],
        post_id: 1
    )
    comment.save
end

for x in 0..24 do
    reply = Reply.new(
        content: lorem_ipsums[x % 5],
        user_id: user_ids[(x + 2) % 3],
        comment_id: 1
    )
    reply.save
end