class Post < ApplicationRecord
    validates :title, length: {maximum: 255}, presence: true
    validates :content, length: {maximum: 50000}, presence: true
    validate :validate_tags

  # Check tags contain only lowercase letters and numbers, and are all unique.
  def validate_tags
      errors.add(:tags, :invalid) if tags.any? { |tag| !tag.match(/^[0-9a-z]{1,10}$/) }
      errors.add(:tags, :invalid) if tags != tags.uniq
  end

  belongs_to :user, optional: true
  has_many :comments
  has_many :post_votes
end
