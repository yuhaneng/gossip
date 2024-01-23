class PostVote < ApplicationRecord
  # Validates uniqueness of user_id and post_id together.
  validates :user_id, presence: true, uniqueness: { scope: :post_id }
  validates :post_id, presence: true

  belongs_to :user
  belongs_to :post
end
