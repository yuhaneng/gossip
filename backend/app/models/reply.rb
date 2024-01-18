class Reply < ApplicationRecord
  validates :content, length: {maximum: 255}, presence: true
  
  belongs_to :user
  belongs_to :comment
  has_many :reply_votes
end
