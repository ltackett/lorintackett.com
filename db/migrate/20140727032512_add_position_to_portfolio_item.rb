class AddPositionToPortfolioItem < ActiveRecord::Migration
  def change
    add_column :portfolio_items, :position, :integer
  end
end
