class CommentVote < ApplicationRecord
  # Validates uniqueness of user_id and comment_id together.
  validates :user_id, presence: true, uniqueness: { scope: :comment_id }
  validates :comment_id, presence: true

  belongs_to :user
  belongs_to :comment
end
