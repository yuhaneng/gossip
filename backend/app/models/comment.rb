class Comment < ApplicationRecord
  validates :content, length: {maximum: 255}, presence: true

  belongs_to :user
  belongs_to :post
end
