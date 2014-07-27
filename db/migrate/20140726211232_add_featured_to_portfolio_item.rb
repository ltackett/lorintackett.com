class AddFeaturedToPortfolioItem < ActiveRecord::Migration
  def change
    add_column :portfolio_items, :featured, :boolean
  end
end
