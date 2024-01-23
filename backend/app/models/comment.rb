class Comment < ApplicationRecord
  validates :content, length: {maximum: 255}, presence: true

  belongs_to :user, optional: true
  belongs_to :post
  has_many :replies
  has_many :comment_votes
end
