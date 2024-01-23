class User < ApplicationRecord
    # Validates password_digest presence, includes instance methods authenticate and password=
    has_secure_password
    
    validates :username, length: { maximum: 20 }, presence: true, uniqueness: true
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, presence: true, uniqueness: true
    validates :about, length: { maximum: 1000 }

    has_many :posts
    has_many :comments
    has_many :replies
    has_many :post_votes
    has_many :comment_votes
    has_many :reply_votes
end
