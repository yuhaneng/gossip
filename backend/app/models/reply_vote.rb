class ReplyVote < ApplicationRecord
  # Validates uniqueness of user_id and reply_id together.
  validates :user_id, presence: true, uniqueness: { scope: :reply_id }
  validates :reply_id, presence: true

  belongs_to :user
  belongs_to :reply
end
