class CreateProducts < ActiveRecord::Migration[7.0]
  def change
    create_table :products do |t|
      t.string :name
      t.string :category
      t.string :image
      t.string :description
      t.integer :price
      t.string :brand
      t.float :rating, default: 0.0
      t.integer :countInStock
      t.integer :numReviews, default: 0

      t.timestamps
    end
  end
end
