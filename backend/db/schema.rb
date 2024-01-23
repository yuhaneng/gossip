# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_01_18_095344) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comment_votes", force: :cascade do |t|
    t.uuid "user_id"
    t.bigint "comment_id"
    t.boolean "vote"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_comment_votes_on_comment_id"
    t.index ["user_id"], name: "index_comment_votes_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.uuid "user_id"
    t.bigint "post_id"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "post_votes", force: :cascade do |t|
    t.uuid "user_id"
    t.bigint "post_id"
    t.boolean "vote"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_post_votes_on_post_id"
    t.index ["user_id"], name: "index_post_votes_on_user_id"
  end

  create_table "posts", force: :cascade do |t|
    t.uuid "user_id"
    t.string "title"
    t.text "content"
    t.string "tags", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tags"], name: "index_posts_on_tags", using: :gin
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "replies", force: :cascade do |t|
    t.uuid "user_id"
    t.bigint "comment_id"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_replies_on_comment_id"
    t.index ["user_id"], name: "index_replies_on_user_id"
  end

  create_table "reply_votes", force: :cascade do |t|
    t.uuid "user_id"
    t.bigint "reply_id"
    t.boolean "vote"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reply_id"], name: "index_reply_votes_on_reply_id"
    t.index ["user_id"], name: "index_reply_votes_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.boolean "admin", default: false
    t.string "about", default: ""
    t.boolean "ui_style", default: false
    t.boolean "privacy", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "comment_votes", "comments", on_delete: :cascade
  add_foreign_key "comment_votes", "users", on_delete: :cascade
  add_foreign_key "comments", "posts", on_delete: :cascade
  add_foreign_key "comments", "users", on_delete: :nullify
  add_foreign_key "post_votes", "posts", on_delete: :cascade
  add_foreign_key "post_votes", "users", on_delete: :cascade
  add_foreign_key "posts", "users", on_delete: :nullify
  add_foreign_key "replies", "comments", on_delete: :cascade
  add_foreign_key "replies", "users", on_delete: :nullify
  add_foreign_key "reply_votes", "replies", on_delete: :cascade
  add_foreign_key "reply_votes", "users", on_delete: :cascade
end
