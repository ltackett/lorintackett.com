class AddFeaturedImageToPortfolioItem < ActiveRecord::Migration
  def change
    add_column :portfolio_items, :featured_image, :string
  end
end
