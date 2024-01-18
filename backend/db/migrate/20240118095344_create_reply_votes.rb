class CreateReplyVotes < ActiveRecord::Migration[7.1]
  def change
    create_table :reply_votes do |t|
      t.references :user, type: :uuid, foreign_key: {to_table: :users, on_delete: :cascade}, index: true
      t.references :reply, foreign_key: {to_table: :replies, on_delete: :cascade}, index: true
      t.boolean :vote

      t.timestamps
    end
  end
end
